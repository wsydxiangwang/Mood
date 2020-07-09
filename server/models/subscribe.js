/* 
 * 邮箱订阅
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: String,
    code: String,
    time: Number,
    active: Boolean
})

module.exports = mongoose.model('subscribe', schema)