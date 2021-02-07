const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String,
    isForgotPassword: Boolean,
    code: String
})

module.exports = mongoose.model('user', schema)