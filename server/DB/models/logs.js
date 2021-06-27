const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema({
    username:String,
    userId: String,
    text: String,
    postedOn: Date,
    likes: [String],
})


const logs = new Schema({
    timeInMins: Number,
    instruments: [String],
    categories: [String],
    title: String,
    ratingStars: Number,
    users: [String],
    parentUser: String,
    date: Date,
    comments: [Comment],
    likes: [String],
    isPrivate: Boolean,
    type:String

})

const LogsModel = mongoose.model("logs", logs)


module.exports = LogsModel