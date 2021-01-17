// 信息
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    base: {
        admin_avatar: String,   // 管理员头像
        admin_name: String,     // 管理员昵称
        name: String,           // 网站名字
        address: String,        // 网站域名
        describe: String,       // 网站描述
        seo: String,            // SEO关键词
        upload_type: String,    // 文件上传方式
        email_type: String,     // 邮箱类型
        email_pass: String      // 邮箱PASS码
    },

    administrator: {
        email: String,          // 邮箱
        name: String,           // 名字
        mark: String,           // 标识
        code: String,           // 验证码
        comment: Boolean,       // 评论通知
        message: Boolean,       // 留言页面
        subscribe: Boolean      // 订阅通知
    },

    page_music: {                   // 背景音乐
        mood: String,
        letter: String,
        subscribe: String,
        message: String,
        about: String
    },

    other: {
        icp_txt: String,            // 备案号
        icp_link: String,           // 备案链接
        password: String,           // 原密码
        password_new: String        // 新密码
    },
    
    cover: {                        // 首屏效果
        date: String,
        title: String,
        link: String,
        color: String,
        image: String,
        describe: String
    },

    aliyun_oss: {                   // 阿里云oss
        bucket: String,
        region: String,
        accessKeySecret: String,
        accessKeyId: String,
        domain: String
    }
})

module.exports = mongoose.model('Info', schema)