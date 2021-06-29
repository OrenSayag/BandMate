const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const Comment = new Schema({
    text: {
        type: String,
        required: true
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: ObjectId,
        ref: "users"
    }],
    userId: {
        type: ObjectId,
        ref: "users",
        required:true
    }
})


const recordings = new Schema({
    fileSrc: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        required: true
    },
    ratingStars: {
        type: Number,
        default: 0,
        mix: 0,
        max: 5
    },
    users: [{
        type: ObjectId,
        ref: "users",

    }],
    title: {
        type: String,
        default: ""
    },
    parentUser: {
        type: ObjectId,
        required: true,
        ref: "users"
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [Comment],
    likes: [{
        type: ObjectId,
        ref:"users"
    }],
    isPrivate: Boolean,
    type: {
        type: String,
        required: true
    }
})

const RecordingsModel = mongoose.model("recordings", recordings)

module.exports = RecordingsModel