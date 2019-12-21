/* 
 * 分类模块
*/

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String
})

module.exports = mongoose.model('Category', schema)