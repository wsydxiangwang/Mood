module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/article')
    const Comment = require('../../models/comment')        
    const Counter = require('../../models/counter')
    const getPage = require('../../plugins/getPage')
    const requestResult = require('../../plugins/requestResult')

    const sendEmail = require('../../plugins/email')

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
        }, (err, doc) => {
            return doc;
        })

        // 添加评论id
        req.body.id = commentCount.count;
        const result = await Comment.create(req.body)
        res.send(requestResult(result))
        
        const articleData = await Article.findOne({id: req.body.topic_id})

        const title = articleData.title,
              url = req.body.url,
              name = req.body.reply_name,
              email = req.body.reply_email;

        // 发送邮件
        // sendEmail(title, url, name, email)
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