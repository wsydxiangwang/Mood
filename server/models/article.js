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
    like: {                             // 点赞
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
    music: {                            // 音乐
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    },                      
    image: {                             // 封面
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    },                      
})

module.exports = mongoose.model('Article', schema)