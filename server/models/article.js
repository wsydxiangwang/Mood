/* 
 * 文章模块
*/

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
    time: {
        default: String,
        date: String,
        month1: String,
        month2: String,
        year: String,
        day: String,
        hour: String
    },
    like: Number,
    words: Number,
    comment: {}
})

module.exports = mongoose.model('Article', schema)