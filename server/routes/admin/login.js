module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let { User, Info } = model
    let { RequestResult } = plugin

    const crypto = require('crypto');
    const jwt = require('jsonwebtoken');

    // 修改密码
    router.post('/password', (req, res) => {
        const [password, passwords] = ['p1', 'p2'].map(i => {
            return crypto.createHash('sha256').update(req.body[i]).digest('hex')
        })
        User.findOne({ password }, (err, docs) => {
            if (docs) {
                User.findOneAndUpdate({
                    password
                }, {
                    $set: { 
                        password: passwords
                    }
                }, (err, doc) => {
                    res.send(RequestResult(1, '密码修改成功'))
                })
            } else {
                res.send(RequestResult(2, '原密码输入错误'))
            }
        })
    })

    // 登录
    router.post('/login', async (req, res) => {
        if (Object.keys(req.body).length != 2) {
            res.send(RequestResult(2, {
                message: '请填写完整的信息！',
            }))
            return
        }
        const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        const info = {
            username: req.body.username,
            password
        }
        User.find(info, (err, docs) => {
            if (docs.length != 0) {
                const token = jwt.sign(info, 'Libai', {
                    expiresIn: 60 * 60 * 24
                })
                res.send(RequestResult(1, {
                    message: '登录成功',
                    token
                }))
            } else {
                res.send(RequestResult(2, {
                    message: '用户名或密码错误！',
                }))
            }
        })
    })

    // 创建账号
    router.post('/user', async (req, res) => {
        const len = await User.find().countDocuments()
        const pwd = crypto.createHash('sha256').update(req.body.password).digest('hex');
        const user = {
            username: req.body.name,
            password: pwd
        }
        const info = {
            base: { 
                email_pass: req.body.pass,
                email_type: req.body.email_type
            },
            administrator: { email: req.body.email }
        }
        if (len) {
            res.json({
                status: 2,
                message: '请勿重复注册！',
            })
        } else {
            // 创建账号
            User.create(user, (err, docs) => {
                if (docs.length != 0) {
                    res.json({
                        status: 1,
                        message: '注册成功！'
                    })
                } else {
                    res.json({
                        status: 2,
                        message: '注册失败，服务器或数据库出错！'
                    })
                }
            })
            Info.create(info)
        }
    })
    app.use('/admin/api', router)
}