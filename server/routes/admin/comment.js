module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let { Comment, Counter, Article, Info } = model
    let { Email, GetPage, RequestResult } = plugin


    // Get comment
    router.get('/comment', async (req, res) => {
        const p = req.query.page
        const s = req.query.count || 10
        const data = await GetPage(Comment, p, s)
        res.send(RequestResult(1, data))
    })

    // Delete
    router.delete('/comment', async (req, res) => {
        const id = req.query.id
        await Comment.deleteOne({ id })
        // delete children
        if (!req.body.parent_id) {
            await Comment.deleteMany({ parent_id: id })
        }
        res.send(RequestResult(1, 1))
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
        
        // Add in comment id
        req.body.data.id = commentCount.count
        const result = await Comment.create(req.body.data)

        res.send(RequestResult(1, result))
        
        // Send Email
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
            Email(3, data, infos)
        }
    })

    // 一键已读
    router.post('/comment_read', (req, res) => {
        Comment.updateMany({
            status: 1
        }, {
            $set: { status : 2 }
        }, {
            multi: true
        }, (err, doc) => {
            res.send(RequestResult(err, doc))
        })
    })
    app.use('/admin/api', router)
}