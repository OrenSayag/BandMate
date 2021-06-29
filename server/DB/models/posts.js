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
    username:{
        type:String,
        required: true
    },
    userId: {
        type:ObjectId,
        required: true,
        ref:"users"
    },
})


const posts = new Schema({
    content: String,
    parentUser: {
        type: ObjectId,
        ref:"users"
    },
    date: Date,
    comments: [Comment],
    likes: [String],
    isPrivate: Boolean,
    type:String
})

const PostsModel = mongoose.model("posts", posts)


module.exports = PostsModel