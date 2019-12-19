module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/NewArticle')

    // 添加文章
    router.post('/newArticle', async (req, res) => {
        const model = await Article.create(req.body)
        res.send(model)
    })

    // 获取文章
    router.get('/article', async (req, res) => {
        const data = await Article.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    // 更新文章
    router.get('/updateArticle/:id', async (req, res) => {
        const data = await Article.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    // 添加说说
    router.post('/NewPhrase', async (req, res) => {
        const model = await Phrase.create(req.body)
        res.send(model)
    })

    app.use('/admin/api', router)
}