const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema({
    username:String,
    text: String,
    postedOn: Date,
    likes: [String],
})


const recordings = new Schema({
    fileSrc: String,
    mediaType: String,
    ratingStars: Number,
    users: [String],
    title: String,
    parentUser: String,
    date: Date,
    comments: [Comment],
    likes: [String],
    isPrivate: Boolean
})

const RecordingsModel = mongoose.model("recordings", recordings)

module.exports = RecordingsModel