const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,           // 管理员昵称
    avatar: String,         // 头像地址

    email: String,          // 邮箱
    email_name: String,     // 邮箱名
    email_pass: String,     // 邮箱pass


    address: String,        // 域名

})

module.exports = mongoose.model('info', schema)