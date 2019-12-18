/* 
 * 发布文章 模块
*/

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String,
    content: String,
    describe: String,
    time: String,
    stick: {
        type: Boolean,
        default: false
    },
    category: String,
    image: String
})

module.exports = mongoose.model('Article', schema)