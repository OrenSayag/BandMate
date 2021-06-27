const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema({
    username:String,
    text: String,
    postedOn: Date,
    likes: [String],
})


const posts = new Schema({
    title: String,
    content: String,
    parentUser: String,
    date: Date,
    comments: [Comment],
    likes: [String],
    isPrivate: Boolean,
    type:String
})

const PostsModel = mongoose.model("posts", posts)


module.exports = PostsModel