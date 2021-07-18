const { Schema } = require('mongoose')

const ContentCategory = new Schema({
    name:String,
    color:String,
})

module.exports = ContentCategory