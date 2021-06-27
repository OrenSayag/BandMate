const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema({
    username:String,
    text: String,
    postedOn: Date,
    likes: [String],
})


const messages = new Schema({
    content: String,
    date: Date, 
    from: String,
    to: String,
    isJoinReq: Boolean,
    type:String

})

const MessagesModel = mongoose.model("messages", messages)


module.exports = MessagesModel