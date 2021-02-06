module.exports = (app, plugin, model) => {
    const express = require('express')
    const router = express.Router()
    
    let { Info, Comment, Article, Envelope } = model
    let { DateFormat, RequestResult } = plugin

    router.get('/info', (req, res) => {
        Promise.all([
            Info.findOne(),
            Article.findOne().sort({time: -1}),
            Envelope.find().sort({time: -1}).limit(8),
            Article.countDocuments(),
            Comment.countDocuments(),
            Comment.find({status: 1}).countDocuments()
        ]).then(result => {
            result[2].forEach(item => item._doc['time'] = DateFormat(item.time) )
            const key = [
                'info',         // 个人信息
                'article',      // 第一条文章
                'envelope',     // 短语列表
                'articleQty',   // 文章总数
                'commentQty',   // 评论总数量
                'unread'        // 评论未读数
            ]
            const data = key.reduce((total, item, index) => {
                total[item] = result[index]
                return total
            }, {})
            res.send(RequestResult(null, data))
        })
    })

    router.post('/info', (req, res) => {
        Info.findByIdAndUpdate(
            req.body._id, 
            req.body, 
            (err, doc) => {
                res.send(RequestResult(err, doc))
            })
    })

    app.use('/admin/api', router)
}