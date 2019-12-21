/* 
 * 说说模块
*/

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time: String,
    content: String,
    contentHtml: String,
    title: {
        type: String,
        default: '这是被遗忘的文字'
    },
    stick: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('Phrase', schema)