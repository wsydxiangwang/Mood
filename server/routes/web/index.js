module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/article')
    
    // 获取文章
    router.get('/new', async (req, res) => {
        const data = await Article.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    app.use('/web/api', router)
}