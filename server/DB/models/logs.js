const mongoose = require("mongoose")
const Schema = mongoose.Schema
const  {ObjectId} = Schema.Types

const Comment = new Schema({
    username:{
        type:String,
        required: true
    },
    userId: {
        type:ObjectId,
        required: true,
        ref:"users"
    },
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
})


const logs = new Schema({
    timeInMins: Number,
    instruments: [{
        type: ObjectId,
        ref:"instruments"
    }],
    categories: [String],
    title: String,
    ratingStars: Number,
    users: [{
        type: ObjectId,
        ref:"users"
    }],
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

const LogsModel = mongoose.model("logs", logs)


module.exports = LogsModel