module.exports = app => {
    const express = require('express');
    const crypto = require('crypto');
    const jwt = require('jsonwebtoken');

    const router = express.Router();
    const User = require('../../models/user')

    // 登录
    router.post('/login', (req, res) => {
        let pwd = crypto.createHash('sha256').update(req.body.password).digest('hex');
        let info = {
            username: req.body.username,
            password: pwd
        }

        let token = jwt.sign(info, 'Libai', {
            expiresIn: 60 * 60 * 24  // 24小时过期
        }); 
        res.json({
            status: 1,
            message: 'ok',
            token: token
        })
        /**
         * 查找数据库是否有此用户
         */
        // User.find(info, (err, docs) => {
        //     if(docs.length != 0){
        //         // 生成token
        //         let token = jwt.sign(info, 'Libai', {
        //             expiresIn: 60 * 60 * 24  // 24小时过期
        //         }); 
        //         res.json({
        //             status: 1,
        //             message: 'ok',
        //             token: token
        //         })
        //     }else{
        //         res.json({
        //             status: 2,
        //             message: '用户名或密码错误！'
        //         })
        //     }
        // })
    })
    app.use('/admin/api', router)
}