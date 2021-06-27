const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema({
    username:String,
    text: String,
    postedOn: Date,
    likes: [String],
})


const groupConversations = new Schema({
    userIds:[String],
    name:String,
    creationDate:Date,
    admins:[String],
})

const GroupConversationsModel = mongoose.model("groupConversations", groupConversations)


module.exports = GroupConversationsModel