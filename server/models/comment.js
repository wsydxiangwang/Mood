/* 
 * 留言模块
*/

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userName: String,
    time: String,
    content: String,
    contentHtml: String,
})

module.exports = mongoose.model('Comment', schema)