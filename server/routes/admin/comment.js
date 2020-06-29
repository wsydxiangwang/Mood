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
        const data = await Comment.deleteOne({id})
        /**
         * 删除所有子评论
         */
        if(!req.body.parent_id){
            await Comment.deleteMany({parent_id:id})
        }
        res.send(requestResult(data))
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
        const articleData = await Article.findOne({id: req.body.data.topic_id})
        
        if(req.body.email.email_message){
            const obj = {
                title: articleData.title,
                url: req.body.email.address + '/' + req.body.data.topic_id,
                name: req.body.data.reply_name,
                email: req.body.data.reply_email
            }
            // 发送邮件
            email(obj, req.body.email)
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