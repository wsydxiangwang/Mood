module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let { Comment, Counter, Article, Info } = model
    let { email, getPage, requestResult } = plugin


    // Get comment
    router.get('/comment', async (req, res) => {
        const p = req.query.page;
        const s = req.query.count || 10;
        const data = await getPage(Comment, p, s)
        res.send(requestResult(1, data))
    })

    // Delete
    router.delete('/comment', async (req, res) => {
        const id = req.query.id;
        await Comment.deleteOne({ id })
        // 一级评论，则删除所有子评论
        if (!req.body.parent_id) {
            await Comment.deleteMany({ parent_id: id })
        }
        res.send(requestResult(1))
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

        res.send(requestResult(1, result))
        
        // 默默地发送邮件通知
        const info = req.body.email
        if (info.isEmail) {
            const articleData = await Article.findOne({ id: req.body.data.topic_id })
            const infos = await Info.findOne()
            const data = {
                title: articleData.title,
                url: info.url,
                name: info.name,
                email: info.email
            }
            email(3, data, infos)
        }
    })

    // 一键已读
    router.post('/comment_read', async (req, res) => {
        const result = await Comment.updateMany({
            status: 1
        }, {
            $set: { status : 2 }
        }, {
            multi: true
        }, (err, doc) => {
            return doc;
        })
        res.send(requestResult(1, result))
    })
    app.use('/admin/api', router)
}