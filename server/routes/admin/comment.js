module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let {Comment, Counter, Article} = model
    let {email, getPage, requestResult} = plugin


    // Get comment
    router.get('/comment', async (req, res) => {
        const p = req.query.page || 1;
        const s = req.query.count || 10;

        const data = await getPage(Comment, p, s)
        res.send(requestResult(data))
    })

    // Delete
    router.delete('/comment', async (req, res) => {
        const id = req.body.id;

        // 删除评论 未读-1
        const result = await Promise.all([
            Comment.deleteOne({id}),
            Counter.findOneAndUpdate({
                name: 'comment_read'
            }, {
                $inc: { 'count' : -1 }
            })
        ])

        // 删除所有子评论 & 未读数量
        if(!req.body.parent_id){
            const a = await Comment.deleteMany({parent_id:id})
            await Counter.findOneAndUpdate({
                name: 'comment_read'
            }, {
                $inc: { 'count' : -(a.n) }
            })
        }

        res.send(requestResult(result[0]))
    })

    // Reply
    router.post('/comment', async (req, res) => {
        const commentCount = await Counter.findOneAndUpdate({
            name: 'comment'
        }, {
            $inc: { 'count' : 1 }
        }, {
            new: true
        })
        
        // 添加评论id
        req.body.data.id = commentCount.count;
        const result = await Comment.create(req.body.data)

        res.send(requestResult(result))
        
        // 邮件信息
        if(req.body.email.comment){
            const articleData = await Article.findOne({id: req.body.data.topic_id})
            const data = {
                title: articleData.title,
                url: req.body.email.web_address + '/' + req.body.data.topic_id,
                name: req.body.data.reply_name,
                email: req.body.data.reply_email
            }
            // 发送邮件
            email(3, data, req.body.email)
        }
    })

    // 一键已读
    router.post('/comment_read', async (req, res) => {
        await Counter.findOneAndUpdate({
            name: 'comment_read'
        }, { 'count' : 0 })

        const comment = await Comment.updateMany({
            status: 1
        }, {
            $set: { status : 2 }
        }, {
            multi: true
        }, (err, doc) => {
            return doc;
        })

        res.send(requestResult(comment))
    })
    app.use('/admin/api', router)
}