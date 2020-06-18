const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,           // 管理员昵称
    avatar: String,         // 管理员头像
    address: String,        // 网站地址
    web_name: String,       // 网站名
    web_describe: String,   // 网站描述

    email: String,          // 邮箱
    email_name: String,     // 邮箱名
    email_pass: String,     // 邮箱pass
    email_message: {        // 邮件通知
        type: Boolean,
        default: false
    }, 

    upload_type: String,    // 文件上传方式
    upload_oss: {           // 阿里云OSS
        bucket: String,
        region: String,
        endPoint: String,
        accessKeyId: String,
        accessKeySecret: String,
        domain: String
    },

    bg: {
        bg_mood: String,
        bg_about: String,
        bg_letter: String,
    },
    
    cover: {                // 首屏效果
        date: String,
        title: String,
        link: String,
        color: String,
        image: String,
        describe: String,
        icp_txt: String,
        icp_link: String
    },
})

module.exports = mongoose.model('Info', schema)