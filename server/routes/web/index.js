module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const email = require('../../plugins/email.js'); 
    
    const Comment = require('../../models/comment')
    const Article = require('../../models/article')
    const Counter = require('../../models/counter')
    const Envelope = require('../../models/envelope')
    const dateFormat = require('../../plugins/dateFormat')
    const requestResult = require('../../plugins/requestResult')

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
            req.body.id = commentCount.count;
            const result = await Comment.create(req.body)
            res.send(requestResult(result))
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

            req.body.id = count.count;
            const result = await Comment.create(req.body)
            res.send(requestResult(result))
        }
        
        // 发送通知邮件
        const type = req.body.parent_id;
        if(type){
            console.log(req.body)
        }
        // emailFn('1915398623@qq.com')
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

    
    function emailFn(item){
        // email
        let data = {
            email: item.email,
            title: item.title,
            content: `
                <center>
                    <table style="max-width:800px;letter-spacing: 0.2px;">
                        <tbody>
                            <tr>
                                <td>
                                    <div style="padding: 30px;color: #303030;border-radius: 8px;box-shadow: 0 0 10px #eee;padding: 1.5rem;">
                                        <h2 style="font-size: 16px;font-weight: 400;font-style: oblique;font-size:font-size: 1rem;">hi，${item.name}，你今天笑了么～</h2>
                                        <p style="text-indent: 2em;color:#303030;font-size: 0.9rem;line-height: 24px;">偷偷告诉你一件事，您在《<a href="${item.url}">${item.title}</a>》的心情中，收到一条新的回复啦，赶紧<a href="${item.url}">回来看看</a>是哪位神仙眼光这么好，竟然选到了世界上最棒的人～</p>
                                        <p style="text-align: right;margin-top: 40px;font-size:0.9rem">—— 白茶</p>
                                        <div style="background: #eff5fb;border-left: 4px solid #c2e1ff;padding: 14px;margin-top: 30px;border-radius: 9px;font-size: 0.85rem;color: #7d7f7f;line-height: 24px;">如果我们没有机会见面，那我在这儿提前预祝你早安、午安以及晚安<br>愿你所见皆彩虹，所遇皆良人，所求皆所愿，所盼皆所期<br>永远相信美好的事情即将发生～～</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            `
        }
        email.sendMail(data, (state) => {
            console.log(state)
        })
    }

    app.use('/web/api', router)
}
