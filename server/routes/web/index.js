module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/article')
    const Envelope = require('../../models/envelope')

    // All articles
    router.get('/article', async (req, res) => {
        let data = await Article.find({hide:false}).sort({time: -1}).limit(20)
        res.send(data)
    })

    // Current article
    router.get('/article/:id', async (req, res) => {
        const data = await Article.findOne({id: req.params.id})
        res.send(data)
    })

    // Post a comment
    router.put('/article_comment/:id', async (req, res) => {
        const data = await Article.updateOne({
            '_id': req.params.id
        }, {
            $push:{
                "comment": req.body
            }
        })
        res.send(data)
    })

    // like +1
    router.put('/article_like/:id', async (req, res) => {
        let data = await Article.updateOne({
                '_id': req.params.id
            }, {
                $inc: { 'like': 1 }
            })
        res.send(data)
    })

    // read +1
    router.put('/article_read/:id', async (req, res) => {
        let data = await Article.updateOne({
                '_id': req.params.id
            }, {
                $inc: { 'read': 1}
            })
        res.send(data)
    })


    // envelope
    router.get('/envelope', async (req, res) => {
        const data = await Envelope.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    app.use('/web/api', router)
}
