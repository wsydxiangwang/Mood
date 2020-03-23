module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/article')
    const Counter = require('../../models/counter')         // 计时器 自增

    // 获取文章
    router.get('/article', async (req, res) => {
        const data = await Article.find({}).sort({time: -1}).limit(20)
        res.send(data)
    })

    // 获取指定id文章
    router.get('/article/:id', async (req, res) => {
        const data = await Article.findOne({id: req.params.id})
        res.send(data)
    })


    // 添加文章
    router.post('/article', (req, res) => {
        Counter.findOneAndUpdate({
            name: 'time'
        }, {
            $inc: { 'count' : 11 }
        }, {
            new: true
        }, (err, doc) => {
            if(doc){
                // 自定义id
                req.body.id = doc.count;
                const model = Article.create(req.body)
                res.send(model)
            }
        })
    })

    // 更新文章
    router.put('/article/:id', async (req, res) => {
        const data = await Article.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            (err, doc) => {
                if(doc){
                    res.send({
                        status: 1,
                        message: 'success'
                    })
                }else{
                    res.send({
                        status: 2,
                        message: 'error'
                    })
                }
            })
    })

    // 删除文章
    router.delete('/article/:id', async (req, res) => {
        await Article.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    app.use('/admin/api', router)
}