module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const requestResult = require('../../plugins/requestResult')

    const Info = require('../../models/info')
    const Comment = require('../../models/counter')
    const Counter = require('../../models/counter')
    const Article = require('../../models/article')

    router.get('/info', async (req, res) => {
        const info = await Info.findOne()
        const unread = await Counter.findOne({name: 'comment_read'})
        const articleQty = await Article.countDocuments()
        const commentQty = await Comment.countDocuments()
        const article = await Article.findOne().sort({time: -1})

        const data = {
            info,
            article,
            articleQty,
            commentQty,
            unread: unread.count,
        }
        res.send(requestResult(data))
    })

    router.post('/info', async (req, res) => {
        if(req.body._id){
            const result = await Info.findByIdAndUpdate(
                req.body._id, 
                req.body, 
                (err, doc) => {
                    return doc
                })
            res.send(requestResult(result))
        }else{
            const result = await Info.create(req.body)
            res.send(requestResult(result))
        }
    })

    app.use('/admin/api', router)
}