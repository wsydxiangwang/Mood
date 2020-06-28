/* 
 * 信封 时光机
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time: String,
    content: String,
    contentHtml: String,
})

module.exports = mongoose.model('Envelope', schema)