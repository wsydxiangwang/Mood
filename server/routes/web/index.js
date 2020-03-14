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

    // email
    // let data = {
    //     email: '1409103874@qq.com',
    //     title: '谁让你评论我的',
    //     content: `
    //         <style>
    //         .node-email{
    //             color:red;
    //         }
    //         </style>
    //         <div class="node-email">1234234</div>
    //     `
    // }
    // email.sendMail(data, (state) => {
    //     console.log(state)
    //     // return res.send(state)
    // })

    app.use('/web/api', router)
}
