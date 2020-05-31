/* 
 * 文章模块
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: Number,                         
    title: String,                      // 标题
    words: Number,                      // 字数
    content: String,                    // 内容
    describe: String,                   // 描述
    contentHtml: String,                // 内容源码
    time: String,
    like: {                             // 喜欢
        type: Number,
        default: 0
    },                       
    read: {                             // 阅读
        type: Number,
        default: 0
    },                      
    hide: {                             // 隐藏
        type: Boolean,
        default: false
    },
    music: {
        type: String,                      // 音乐
        default: 'https://image.raindays.cn/music/shunjiandeyongheng.mp3'
    },
    image: {
        type: String,                      // 封面
        default: 'https://image.yeyucm.cn/img/mood-NationalDay/5.jpg'
    },
})

module.exports = mongoose.model('Article', schema)