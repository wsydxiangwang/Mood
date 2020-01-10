module.exports = app => {
    const db = require('mongoose');
    const jwt = require('jsonwebtoken');
    const express = require('express');

    const router = express.Router();

    const Article = require('../../models/article')
    const Phrase = require('../../models/phrase')
    const Category = require('../../models/category')
    const User = require('../../models/user')
    

    router.post('/login', (req, res) => {
        let content = {name: req.body.name}; 
        let key = "jwt";
        let token = jwt.sign(content, key, {
            expiresIn: 60 * 60 * 1  // 1小时过期
        });

        res.json({
            status: 1,
            mess: 'ok',
            token: token,
            user_name: req.body.name
        })
        
        console.log(token)
        
        User.find().exec((err, data) => {
            console.log(data, err)
        })
        // console.log(data)

    })


    // 获取文章
    router.get('/article', async (req, res) => {
        const data = await Article.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    // 获取指定id文章
    router.get('/article/:id', async (req, res) => {
        const data = await Article.findById(req.params.id)
        res.send(data)
    })



    // 添加文章
    router.post('/article', async (req, res) => {
        const model = await Article.create(req.body)
        res.send(model)
    })

    // 更新文章
    router.put('/article/:id', async (req, res) => {
        const data = await Article.findByIdAndUpdate(req.params.id, req.body)
        // const data = await Article.updateOne({_id: req.params.id}, req.body)
        res.send(data)
    })

    // 删除文章
    router.delete('/article/:id', async (req, res) => {
        await Article.findByIdAndDelete(req.params.id, req.body)
        // const data = await Article.updateOne({_id: req.params.id}, req.body)
        res.send({
            success: true
        })
    })

    // 获取说说
    router.get('/phrase', async (req, res) => {
        const data = await Phrase.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    // 添加说说
    router.post('/phrase', async (req, res) => {
        const model = await Phrase.create(req.body)
        res.send(model)
    })

    // 更新说说
    router.put('/phrase/:id', async (req, res) => {
        const data = await Phrase.findByIdAndUpdate(req.params.id, req.body)
        res.send(data)
    })

    // 删除说说
    router.delete('/phrase/:id', async (req, res) => {
        await Phrase.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

 
    

    app.use('/admin/api', router)
}