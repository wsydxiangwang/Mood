const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,           // 管理员昵称
    avatar: String,         // 管理员头像
    address: String,        // 网站地址

    email: String,          // 邮箱
    email_name: String,     // 邮箱名
    email_pass: String,     // 邮箱pass
    email_message: {        // 邮件通知
        type: Boolean,
        default: false
    }, 

    upload_type: String,    // 文件上传方式

    cover: {                // 首屏效果
        date: String,
        link: String,
        color: String,
        image: String,
        describe: String,
    },
})

module.exports = mongoose.model('info', schema)