module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();

    let {Info, Comment, Counter, Article, Envelope, Myself, Subscribe} = model
    let {time, Email, DateFormat, RequestResult} = plugin

    router.get('/info', async (req, res) => {
        const info = await Info.findOne()
        res.send(RequestResult(1, info))
    })

    // All articles
    router.get('/article', async (req, res) => {
        const page = req.query.page || 1;

        const result = await Promise.all([
            Article.countDocuments(),
            Article.find({hide:false}).sort({time:-1}).limit(Number(10)).skip(Number(10)*(page-1))
        ])

        result[1].forEach(item => item._doc['time'] = DateFormat(item.time))

        // 列表页 分组
        if(req.query.from){ 
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

        res.send(RequestResult(1, data))
    })

    // Get article
    router.get('/article/:id', async (req, res) => {
        const id = Number(req.params.id)
        const data = await Article.findOneAndUpdate({
            id: id
        }, {
            $inc: { 'read': 1 }
        }, {
            new: true
        })
        if (data) {
            data._doc['time'] = DateFormat(data.time)
            res.send(RequestResult(1, data))
        } else {
            res.send(RequestResult())
        }
    })

    // Get comment
    router.get('/comment/:id', async (req, res) => {
        const id = Number(req.params.id)
        const result = await Comment.find({topic_id: id})

        // 一级评论和子级评论格式转化
        const data = result.reduce((total, item, index, arr) => {    
            item._doc['time'] = DateFormat(item.time)
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
        
        res.send(RequestResult(1, { data, total }))
    })
    
    // Post a comment
    router.post('/comment', async (req, res) => {
        const commentCount = await Counter.findOneAndUpdate({
            name: 'comment'
        }, {
            $inc: { 'count' : 1 }
        }, {
            new: true
        })

        if (commentCount) {
            req.body.data.id = commentCount.count;
        } else {
            /**
             * 第一次发表评论
             * 创建自增id字段
             */
            const data = {
                name: 'comment',
                count: 1
            }
            const count = await Counter.create(data)
            req.body.data.id = count.count;
        }
        
        /**
         * 返回评论数据，页面展示
         */
        const result = await Comment.create(req.body.data)
        if (result.type === 1) {
            result._doc['child'] = [];
        }
        result._doc['time'] = DateFormat(result.time)

        res.send(RequestResult(1, result))
        
        /**
         * 默默de发送邮件通知
         */
        if (req.body.isEmail) {
            const info = await Info.findOne()
            const data = {
                title: req.body.title,
                url: req.body.url,
                name: req.body.data.reply_name || info.administrator.name,
                email: req.body.data.reply_email || info.administrator.email
            }
            Email(3, data, info)            
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

    // envelope
    router.get('/envelope', async (req, res) => {

        const page = req.query.page || 1;

        const result = await Promise.all([
            Envelope.countDocuments(),
            Envelope.find().sort({time:-1}).limit(Number(10)).skip(Number(10)*(page-1))
        ])
        
        result[1].forEach(item => {
            item._doc['time'] = time(item.time)
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
        res.send(RequestResult(data))
    })

    router.get('/myself', async (req, res) => {
        const result = await Myself.findOne()
        res.send(RequestResult(result))
    })

    // subscribe
    router.post('/subscribe', async (req, res) => {
        const result = await Subscribe.findOne({email: req.body.email})

        const send = {
            email: req.body.email,
            url: `${req.headers.origin}/subscribe?code=${req.body.code}&email=${req.body.email}`
        }

        // 添加验证 or 重新验证
        if(!result || !result.active){
            get_data(Object.prototype.toString.call(result) === "[object Null]")
        } else {
            // 已验证
            res.send(RequestResult())
        }

        async function get_data(type){
            let data = '';
            if(type){
                data = await Promise.all([
                    Subscribe.create(req.body),
                    Info.findOne()
                ])
            } else {
                data = await Promise.all([
                    Subscribe.findOneAndUpdate({
                        email: req.body.email
                    }, req.body, {
                        new: true
                    }),
                    Info.findOne()
                ])
            }
            res.send(RequestResult(data[0]))

            const email_info = Object.assign({}, data[1]['email'], {web_name: data[1]['web_name']})
            Email(1, send, email_info) // 发送邮件验证
        }
    })

    // subscribe result
    router.post('/subscribe_result', async (req, res) => {
        const result = await Subscribe.findOne({email: req.body.email})
        const time = new Date().setDate(new Date().getDate())

        // 邮箱错误
        if(!result){
            res.send({
                status: 3,
                message: '邮箱错误',
            })
            return;
        }

        // 开始验证
        let data = {message:'success'}
        if(!result.active){
            if(req.body.code == result.code && time < result.time){
                data = await Subscribe.findOneAndUpdate({
                    email: req.body.email
                }, {
                    $set: { active: true }
                }, {
                    multi: true
                }, (err, doc) => {
                    return doc;
                } )
                // 验证成功
                res.send(RequestResult(data))
            } else {
                // 验证失败
                res.send(RequestResult())
            }
        } else {
            // 已验证
            res.send(RequestResult(data))
        }
    })

    app.use('/web/api', router)
}
