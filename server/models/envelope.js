/* 
 * 信封 时光机
*/

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time: {                             // 时间
        date: String,                   
        monthNum: String,               
        monthTxt: String,
        year: String,
        day: String,
        hour: String
    },
    content: String,
    contentHtml: String,
})

module.exports = mongoose.model('Envelope', schema)