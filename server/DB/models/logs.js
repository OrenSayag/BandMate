const mongoose = require("mongoose")
const Schema = mongoose.Schema
const  {ObjectId} = Schema.Types
const ContentCategory = require('./contentCategory')

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


const logs = new Schema({
    timeInMins: {type:Number, required:true},
    instruments: [{
        type: ObjectId,
        ref:"instruments"
    }],
    categories: [ContentCategory],
    title: {type:String},
    ratingStars: {type:Number, default:0},
    users: [{
        type: ObjectId,
        ref:"users"
    }],
    parentUser: {
        type: ObjectId,
        ref:"users",
        required:true,
    },
    date: {type:Date, default:Date.now},
    comments: [Comment],
    likes: [{
        type: ObjectId,
        ref:"users"
    }],
    isPrivate: {type:Boolean, default: false},
    type:{type:String, default: "log"}

})

const LogsModel = mongoose.model("logs", logs)


module.exports = LogsModel