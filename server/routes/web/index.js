module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const email = require('../../plugins/email.js'); 

    const Article = require('../../models/article')
    const Envelope = require('../../models/envelope')


    // const fs = require('fs')
    // const http = require('http')
    // const path = require('path')

    // function toArrayBuffer(buf) {
    //     var ab = new ArrayBuffer(buf.length);
    //     var view = new Uint8Array(ab);
    //     for (var i = 0; i < buf.length; ++i) {
    //         view[i] = buf[i];
    //     }
    //     return ab;
    // }

    // // let paths = path.resolve(__dirname, "https://image.yeyucm.cn/music/qianbaidu.mp3");
    // router.get('/music', (req, res) => {        
    //     fs.readFile('routes/music/qianbaidu.mp3', (err, data) => {
    //         if(err){
    //             console.log(err)
    //         }else{
    //             console.log(toArrayBuffer(data))
    //             res.send(toArrayBuffer(data))
    //         }
    //     })
    // })
    

    // var url = 'http://image.yeyucm.cn/music/qianbaidu.mp3';


    // All articles
    router.get('/article', async (req, res) => {
        let data = await Article.find({hide:false}).sort({time: -1}).limit(20)
        res.send(data)
    })

    // Current article
    router.get('/article/:id', async (req, res) => {
        const data = await Article.findOne({id: req.params.id})
        res.send(data)
    })

    // Post a comment
    router.put('/article_comment/:id', (req, res) => {
        // 回复评论
        if(req.body.type){
            Article.findOneAndUpdate({
                '_id': req.params.id
            }, {
                $set: { 
                    ['comment.' + req.body.index + '.comments'] : req.body.body 
                }
            }, (err, doc) => {
                if(doc){
                    res.send({
                        type: 'reply',
                        message: 'success',
                        status: 1
                    })
                    emailFn(req.body.email)
                }else{
                    res.send({
                        type: 'reply',
                        message: err,
                        status: 2
                    })
                }
            })
        }
        // 发表评论
        else{
            Article.findOneAndUpdate({
                '_id': req.params.id
            }, {
                $push:{
                    "comment": req.body
                }
            }, (err, doc) => {
                if(doc){
                    res.send({
                        status: 1,
                        message: 'success'
                    })
                }else{
                    res.send({
                        status: 2,
                        message: err
                    })
                }
            })
        }
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
        let data = await Article.updateOne({
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
                <style>
                .node-email{
                    padding: 20px;
                    color: #303030;
                    border-radius: 8px;
                    box-shadow: 0 0 10px #eee;
                }
                .node-email .title{
                    font-size: 16px;
                    font-weight: 400;
                    font-style: oblique;
                }
                .node-email .content{
                    text-indent: 2em;
                }
                .node-email .me{
                    text-align: right;
                    margin-top: 40px;
                }
                .node-email .hint{
                    background: #eff5fb;
                    border-left: 4px solid #c2e1ff;
                    padding: 14px;
                    margin-top: 30px;
                    border-radius: 9px;
                    font-size: 13px;
                    color: #7d7f7f;
                    line-height:24px;
                }
                </style>
                <div class="node-email">
                    <h2 class="title">hi，${item.name}，你今天笑了么～</h2>
                    <p class="content">偷偷告诉你一件事，您在《<a href="${item.url}">${item.title}</a>》的心情中，收到一条新的回复啦，赶紧<a href="${item.url}">回来看看</a>是哪位神仙眼光这么好，竟然选到了世界上最棒的人，嘿嘿哈哈～</p>
                    <p class="me">—— 白茶</p>
                    <div class="hint">如果我们没有机会见面，那我在这儿提前预祝你早安、午安以及晚安<br>愿你所见皆彩虹，所遇皆良人，所求皆所愿，所盼皆所期<br>永远相信美好的事情即将发生～～</div>
                </div>
            `
        }
        email.sendMail(data, (state) => {
            console.log(state)
        })
    }

    app.use('/web/api', router)
}
