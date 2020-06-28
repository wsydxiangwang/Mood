/* 
 * 自增id +11
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    count: Number
})

module.exports = mongoose.model('counter', schema)