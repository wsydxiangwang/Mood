/* 
 * 信封 时光机
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time: {                             // 时间
        date: String,                   
        monthNum: String,               
        monthTxt: String,
        monthEn: String,
        year: String,
        day: String,
        dayEn: String,
        week: String,
        weekEn: String,
        hour: String,
        time: String,
        min: String,
    },
    content: String,
    contentHtml: String,
})

module.exports = mongoose.model('Envelope', schema)