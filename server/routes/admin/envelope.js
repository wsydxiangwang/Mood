module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/envelope')

    // 获取文章
    router.get('/envelope', async (req, res) => {
        const data = await Article.find({}).sort({time: -1}).limit(20)
        res.send(data)
    })

    // 获取指定id文章
    router.get('/envelope/:id', async (req, res) => {
        const data = await Article.findOne({id: req.params.id})
        res.send(data)
    })

    app.use('/admin/api', router)
}