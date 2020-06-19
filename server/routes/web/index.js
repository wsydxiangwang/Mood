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

        const data = {
            cover: info.cover,
            avatar: info.avatar,
            web_name: info.web_name,
            web_describe: info.web_describe,
            bg: info.bg,
        }
        res.send(requestResult(data))
    })

    // All articles
    router.get('/article', async (req, res) => {
        const page = req.query.page || 1;

        const result = await Promise.all([
            Article.countDocuments(),
            Article.find({hide:false}).sort({time:-1}).limit(Number(10)).skip(Number(10)*(page-1))
        ])

        result[1].forEach(item => {
            item._doc['time'] = dateFormat(item.time)
        })

        // 列表页 分组
        if(req.query.from){ 
            console.log(2)
            result[1] = result[1].reduce((total, item)=>{
                const [ , year, date] = /(\d+)\/(\d+)/.exec(item.time.date);                
                total['_'+year] = total['_'+year] || {};
                total['_'+year][date] = total['_'+year][date] || [];
                total['_'+year][date].push(item);
                return total
            }, {})         
        }

        /**
         * 数据
         * 当前页
         * 总页数
         */
        const data = {
            data: result[1],
            page: Number(page),
            totalPage: Math.ceil(result[0] / 10),
        }
        res.send(requestResult(data))
    })

    // Get article
    router.get('/article/:id', async (req, res) => {
        const id = Number(req.params.id)
        const data = await Article.findOne({id: id})

        data._doc['time'] = dateFormat(data.time)


        console.log(data)


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

        const page = req.query.page || 1;

        const result = await Promise.all([
            Envelope.countDocuments(),
            Envelope.find().sort({time:-1}).limit(Number(10)).skip(Number(10)*(page-1))
        ])
        
        result[1].forEach(item => {
            item._doc['time'] = addTime(item.time)
        })
        /**
         * 数据
         * 当前页
         * 总页数
         */
        const data = {
            data: result[1],
            page: Number(page),
            totalPage: Math.ceil(result[0] / 10),
        }
        res.send(requestResult(data))
    })


    const Myself = require('../../models/myself')
    
    router.get('/myself', async (req, res) => {
        const result = await Myself.findOne()

        res.send(requestResult(result))
    })


    const addTime = (time) => {

        const timestemp = new Date(time).getTime();

        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const halfamonth = day * 15;
        const month = day * 30;
        const now = new Date().getTime();
        const diffValue = now - timestemp;

        // 如果本地时间反而小于变量时间
        if (diffValue < 0) {
            return 'Just Now';
        }

        // 计算差异时间的量级
        const monthC = diffValue / month;
        const weekC = diffValue / (7 * day);
        const dayC = diffValue / day;
        const hourC = diffValue / hour;
        const minC = diffValue / minute;

        if (monthC > 4) {
            const date = new Date(timestemp);
            const mon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return mon[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        } else {
            const map = {
                [monthC]: "months ago",
                [weekC]: "weeks ago",
                [dayC]: "days ago",
                [hourC]: "hours ago",
                [minC]: "minutes ago",
            }
            for(let i in map){
                if(i >= 1){
                    return `${parseInt(i)} ${map[i]}`
                }
            }
            return 'Just Now';
        }
    }

    app.use('/web/api', router)
}
