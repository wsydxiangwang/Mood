module.exports = app => {
    const express = require('express');
    const router = express.Router();
    
    const Comment = require('../../models/comment')
    const Article = require('../../models/article')
    const Counter = require('../../models/counter')
    const Envelope = require('../../models/envelope')
    const Info = require('../../models/info')

    const sendEmail = require('../../plugins/email')
    const dateFormat = require('../../plugins/dateFormat')
    const requestResult = require('../../plugins/requestResult')

    router.get('/info', async (req, res) => {
        const info = await Info.findOne()

        res.send(requestResult(info))
    })

    // All articles
    router.get('/article', async (req, res) => {
        const p = req.query.page || 1;
        const s = req.query.count || 10;
        const data = await Article.find({hide:false}).sort({time: -1}).limit(Number(s)).skip(Number(s)*(p-1))

        data.forEach(item => {
            item._doc['time'] = dateFormat(item.time)
        })
        
        res.send(data)
    })

    // Get article
    router.get('/article/:id', async (req, res) => {
        const id = Number(req.params.id)
        const data = await Article.findOne({id: id})
        data._doc['time'] = dateFormat(data.time)
        res.send(data)
    })

    // Get comment
    router.get('/comment/:id', async (req, res) => {
        const id = Number(req.params.id)
        const result = await Comment.find({topic_id: id})

        const data = result.reduce((total, item, index, arr) => {    
            item._doc['time'] = dateFormat(item.time)
            if(item.type === 1){
                item._doc['child'] = []
                total.push(item)
            }else{
                total.forEach(i => {
                    if(i.id === item.parent_id){
                        i._doc['child'].push(item)
                    }
                })
            }
            return total
        }, []).reverse()
        
        const total = result.length;
        
        res.send(requestResult({data,total}))
    })
    
    // Post a comment
    router.post('/comment', async (req, res) => {
        const commentCount = await Counter.findOneAndUpdate({
            name: 'comment'
        }, {
            $inc: { 'count' : 1 }
        }, {
            new: true
        }, (err, doc) => {
            return doc;
        })

        if(commentCount){
            req.body.data.id = commentCount.count;
        }else{
            /**
             * 第一次发表文章
             * 创建自增id字段
             */
            const data = {
                name: 'comment',
                count: 1
            }
            const count = await Counter.create(data)
            req.body.data.id = count.count;
        }
        const result = await Comment.create(req.body.data)
        
        /**
         * 未读+1
         */
        const total = await Counter.findOneAndUpdate({
            name: 'comment_read'
        }, {
            $inc: { 'count' : 1 }
        })
        if(!total) await Counter.create({name: 'comment_read', count: 1})

        /**
         * 返回评论数据，页面展示
         */
        if(result.type === 1){
            result._doc['child'] = [];
        }
        result._doc['time'] = dateFormat(result.time)

        res.send(requestResult(result))
        
        const title = req.body.title,
              url = req.body.url,
              name = req.body.data.reply_name,
              email = req.body.data.reply_email;

        // 发送邮件
        // sendEmail(title, url, name, email)
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
        const data = await Article.updateOne({
                '_id': req.params.id
            }, {
                $inc: { 'read': 1}
            })
        res.send(data)
    })

    // envelope
    router.get('/envelope', async (req, res) => {
        var data = await Envelope.find().sort({time: -1}).limit(20)
        res.send(data)
    })

    app.use('/web/api', router)
}
