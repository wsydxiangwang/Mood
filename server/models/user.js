const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String
})

module.exports = mongoose.model('user', schema)