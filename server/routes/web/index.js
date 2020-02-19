module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/article')
    
    // 获取所有文章
    router.get('/article', async (req, res) => {
        const data = await Article.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    // 查找当前文章
    router.get('/article/:id', async (req, res) => {
        const data = await Article.findById(req.params.id)
        res.send(data)
    })

    // 发表评论
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

    // 点赞+1
    router.put('/article_like/:id', async (req, res) => {
        let data = await Article.updateOne({
                '_id': req.params.id
            }, {
                $inc: { 'like': 1}
            })
        res.send(data)
    })

    // 阅读量+1
    router.put('/article_read/:id', async (req, res) => {
        let data = await Article.updateOne({
                '_id': req.params.id
            }, {
                $inc: { 'read': 1}
            })
        res.send(data)
    })

    app.use('/web/api', router)
}
