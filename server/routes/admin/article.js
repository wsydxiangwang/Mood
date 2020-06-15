module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/article')
    const Counter = require('../../models/counter')
    const getPage = require('../../plugins/getPage');
    const requestResult = require('../../plugins/requestResult');

    // 获取文章
    router.get('/article', async (req, res) => {
        const p = req.query.page || 1;
        const s = req.query.count || 10;

        const data = await getPage(Article, p, s)
        res.send(requestResult(data))
    })

    // 获取指定id文章
    router.get('/article/:id', async (req, res) => {
        const data = await Article.findOne({id: req.params.id})
        res.send(requestResult(data))
    })

    // 发布文章
    router.post('/article', async (req, res) => {
        /**
         * 获取计数器,每次自增11
         */
        const articleId = await Counter.findOneAndUpdate({
            name: 'articleId'
        }, {
            $inc: { 'count' : 11 }
        }, {
            new: true
        }, (err, doc) => {
            return doc;
        })

        /**
         * 发布新文章
         */
        if(articleId){
            // 自定义id
            req.body.id = articleId.count;
            const result = await Article.create(req.body)
            res.send(requestResult(result))
        }else{
            /**
             * 第一次发表文章
             * 创建自增id字段
             */
            const data = {
                name: 'articleId',
                count: 1103
            }
            const count = await Counter.create(data)
            
            req.body.id = count.count;
            const result = await Article.create(req.body)
            res.send(requestResult(result))
        }
    })

    // 更新文章
    router.post('/article/:id', async (req, res) => {
        const data = await Article.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            (err, doc) => {
                return doc
            })
        res.send(requestResult(data))
    })

    // 删除文章
    router.delete('/article/:id', async (req, res) => {
        const data = await Article.findByIdAndDelete(req.params.id, req.body)
        res.send(requestResult(data))
    })

    app.use('/admin/api', router)
}