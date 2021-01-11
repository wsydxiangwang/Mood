module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let {Info, Comment, Counter, Article, Envelope} = model
    let {dateFormat, requestResult} = plugin

    router.get('/info', async (req, res) => {
        const result = await Promise.all([
            Info.findOne(),
            Article.findOne().sort({time: -1}),
            Envelope.find().sort({time: -1}).limit(8),
            Article.countDocuments(),
            Comment.countDocuments(),
            Comment.find({status: 1}).countDocuments()
        ])
        result[2].forEach(item => item._doc['time'] = dateFormat(item.time) )

        const key = [
            'info',         // 个人信息
            'article',      // 文章列表
            'envelope',     // 短语列表
            'articleQty',   // 文章总数
            'commentQty',   // 评论总数量
            'unread'        // 评论未读数
        ]
        const data = key.reduce((total, item, index) => {
            total[item] = result[index]
            return total
        }, {})
        
        res.send(requestResult(1, data))
    })

    router.post('/info', async (req, res) => {
        if (req.body._id) {
            const result = await Info.findByIdAndUpdate(
                req.body._id, 
                req.body, 
                (err, doc) => {
                    return doc
                })
            res.send(requestResult(1, result))
        } else {
            const result = await Info.create(req.body)
            res.send(requestResult(1, result))
        }
    })

    app.use('/admin/api', router)
}