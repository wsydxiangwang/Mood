/* 
 * 文章模块
*/
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: Number,  
    title: String,
    words: Number,
    content: String,
    describe: String,
    contentHtml: String,
    time: Number,
    like: {
        type: Number,
        default: 0
    },
    read: {
        type: Number,
        default: 0
    },                      
    hide: {
        type: Boolean,
        default: false
    },
    music: {
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    },                      
    image: {
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    },                      
})

module.exports = mongoose.model('Article', schema)