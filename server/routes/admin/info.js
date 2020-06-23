module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const dateFormat = require('../../plugins/dateFormat'); 
    const requestResult = require('../../plugins/requestResult')

    const Info = require('../../models/info')
    const Comment = require('../../models/comment')
    const Counter = require('../../models/counter')
    const Article = require('../../models/article')
    const Envelope = require('../../models/envelope')

    router.get('/info', async (req, res) => {
        const result = await Promise.all([
            Info.findOne(),
            Article.findOne().sort({time: -1}),
            Envelope.find().sort({time: -1}).limit(8),
            Article.countDocuments(),
            Comment.countDocuments(),
            Counter.findOne({name: 'comment_read'}),
        ])

        result[2].forEach(item => item._doc['time'] = dateFormat(item.time) )

        const key = ['info', 'article', 'envelope', 'articleQty', 'commentQty', 'unread']

        const data = key.reduce((total, item, index) => {
            total[item] = item == 'unread' ? result[index].count : result[index]
            return total
        }, {})
        
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