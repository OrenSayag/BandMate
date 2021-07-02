const mongoose = require("mongoose")
const Schema = mongoose.Schema
const {ObjectId} = Schema.Types

const Comment = new Schema({
    text: {
        type:String,
        required: true
    },
    postedOn: {
        type:String,
        default: Date.now
    },
    likes: [{
        type:ObjectId,
        ref:"users"
    }],
    userId: {
        type:ObjectId,
        required: true,
        ref:"users"
    },
})


const posts = new Schema({
    content: {
        type: String,
        required: true
    },
    parentUser: {
        type: ObjectId,
        required:true,
        ref:"users"
    },
    date: {
        type:Date,
        default:Date.now,
    },
    comments: [Comment],
    likes: [String],
    isPrivate: {
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    }
})

const PostsModel = mongoose.model("posts", posts)


module.exports = PostsModel