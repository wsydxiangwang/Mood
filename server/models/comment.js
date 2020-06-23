/* 
 * 文章评论
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: Number,         // 评论id
    topic_id: Number,   // 主题id
    name: String,       // 昵称
    email: String,      // 邮箱
    image: Number,      // 头像
    time: String,       // 时间
    content: String,    // 内容
    status: {           // 状态 未读
        type: Number,
        default: 1
    },   
    type: {             // 类型 1评论 2回复 3深度回复
        type: Number,
        default: 1
    },     
    parent_id: Number,   // 一级评论id 
    reply_name: String,  // 回复对象
    reply_email: String, // 回复邮箱

    admin: Boolean,      // 管理员
})

module.exports = mongoose.model('Comment', schema)