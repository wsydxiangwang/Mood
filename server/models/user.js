const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userName: String,
    passWord: String
})

module.exports = mongoose.model('user', schema)