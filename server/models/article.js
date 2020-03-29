/* 
 * 文章模块
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: Number,                         
    music: {
        type: String,                      // 音乐
        default: 'https://image.raindays.cn/music/shunjiandeyongheng.mp3'
    },
    image: {
        type: String,                      // 封面
        default: 'https://image.yeyucm.cn/img/mood-NationalDay/5.jpg'
    },
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
        year: String,
        month: String,               
        monthCn: String,
        monthEn: String,
        day: String,
        dayEn: String,
        week: String,
        weekEn: String,
        time: String,
        hour: String,
        min: String,
    },
    like: {                             // 喜欢
        type: Number,
        default: 0
    },                       
    read: {                             // 阅读
        type: Number,
        default: 0
    },                       
    words: {                            // 字数
        type: Number,
        default: 0
    },
    comment: [],                        // 评论
})

module.exports = mongoose.model('Article', schema)