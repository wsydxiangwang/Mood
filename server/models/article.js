/* 
 * 文章模块
*/

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time: String,
    image: String,
    content: String,
    describe: String,
    contentHtml: String,
    title: {
        type: String,
        default: '这是被遗忘的文字'
    },
    category: {
        type: String,
        default: '求个身份'
    },
    stick: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('Article', schema)