/* 
 * 信封 时光机
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time: {                             // 时间
        date: String,                   
        year: String,
        month: String,               
        monthCn: String,
        monthEn: String,
        day: String,
        dayEn: String,
        week: String,
        weekEn: String,
        time: String,
        hour: String,
        min: String,
    },
    content: String,
    contentHtml: String,
})

module.exports = mongoose.model('Envelope', schema)