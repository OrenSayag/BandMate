const mongoose = require("mongoose")
const Schema = mongoose.Schema
const {ObjectId} = mongoose.Types


const groupConversations = new Schema({
    userIds:[{
        type:ObjectId,
        required: true,
        ref:"users"
    }],
    name:{
        type:String,
        required: true,
    },
    creationDate:{
        type:Date,
        default: Date.now,
    },
    admins:[{
        type:ObjectId,
        required: true,
        ref:"users"
    }],
    type:{
        type: String,
        default: "group-conversation"
    }
})

const GroupConversationsModel = mongoose.model("groupConversations", groupConversations)


module.exports = GroupConversationsModel