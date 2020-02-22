/* 
 * 文章模块
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: Number,                         
    music: String,                      // 音乐
    image: String,                      // 封面
    content: String,                    // 内容
    describe: String,                   // 描述
    contentHtml: String,                // 内容源码
    title: String,                      // 标题
    category: String,                   // 分类
    hide: {                             // 隐藏
        type: Boolean,
        default: false
    },
    time: {                             // 时间
        date: String,                   
        monthNum: String,               
        monthTxt: String,
        year: String,
        day: String,
        hour: String
    },
    like: {
        type: Number,
        default: 0
    },                       // 喜欢
    read: {
        type: Number,
        default: 0
    },                       // 阅读
    words: Number,                      // 字数
    comment: [],                        // 评论
})

module.exports = mongoose.model('Article', schema)