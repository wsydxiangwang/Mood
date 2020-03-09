module.exports = app => {
    const express = require('express');
    const router = express.Router();

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
    router.put('/article_comment/:id', async (req, res) => {
        const data = await Article.updateOne({
            '_id': req.params.id
        }, {
            $push:{
                "comment": req.body
            }
        })
        res.send(data)
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
        const data = await Envelope.find().sort({time: -1}).limit(20)

        function dateDiff(timestamp) {
            
            var Time = new Date(timestamp);
            var timestemp = Time.getTime();
            
            // 补全为13位
            var arrTimestamp = (timestemp + '').split('');
            for (var start = 0; start < 13; start++) {
                if (!arrTimestamp[start]) {
                    arrTimestamp[start] = '0';
                }
            }
            timestemp = arrTimestamp.join('') * 1;
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - timestemp;
    
            // 如果本地时间反而小于变量时间
            if (diffValue < 0) {
                return '不久前';
            }
            // 计算差异时间的量级
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
    
            // 数值补0方法
            var zero = function (value) {
                if (value < 10) {
                    return '0' + value;
                }
                return value;
            };
    
            // 使用
            if (monthC > 4) {
                return (function () {
                    var date = new Date(timestemp);
                    return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
                })();
            } else if (monthC >= 1) {
                return parseInt(monthC) + "月前";
            } else if (weekC >= 1) {
                return parseInt(weekC) + "周前";
            } else if (dayC >= 1) {
                return parseInt(dayC) + "天前";
            } else if (hourC >= 1) {
                return parseInt(hourC) + "小时前";
            } else if (minC >= 1) {
                return parseInt(minC) + "分钟前";
            } else {
                return '刚刚';
            }
        };

        let newData = data.forEach(item => {
            let time = dateDiff(item.time.date);
            item['newTime'] = time;
            console.log(item.time)
            console.log(item.newTime)
        })
console.log(newData)
        res.send(data)
    })

    app.use('/web/api', router)

    
}
