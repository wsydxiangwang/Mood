module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let {Counter, Article, Subscribe} = model
    let {getPage, requestResult, email} = plugin

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
        })

        /**
         * 发布新文章
         */
        let result = null;
        if(articleId){
            // 自定义id
            req.body.data.id = articleId.count;
            result = await Article.create(req.body.data)
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
            req.body.data.id = count.count;
            result = await Article.create(req.body.data)
        }
        res.send(requestResult(result))

        // ...Subscribe
        const email_data = req.body.email
        if(email_data.subscribe && !result.hide){
            const sub = await Subscribe.find()
            const email_list = sub.filter(i => i.active)

            // 群发邮件
            if(email_list.length > 0){
                const send_email = email_list.reduce((t, i) => {
                    t.push(i.email)
                    return t
                }, [])
                const data = {
                    title: result.title,
                    url: req.headers.origin + '/' + result.id,
                    email: send_email
                }
                email(2, data, email_data)
            }
        }
    })

    // 更新文章
    router.post('/article/:id', async (req, res) => {
        const data = await Article.findByIdAndUpdate(
            req.params.id, 
            req.body.data, 
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