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
            Counter.findOne({name: 'comment_read'}),
        ])
        
        result[2].forEach(item => item._doc['time'] = dateFormat(item.time) )

        const key = ['info', 'article', 'envelope', 'articleQty', 'commentQty', 'unread']

        const data = key.reduce((total, item, index) => {
            if(item == 'unread'){
                total[item] = result[index] ? result[index].count : 0
            }else{
                total[item] = result[index]
            }
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