const mongoose = require("mongoose")
const Schema = mongoose.Schema
const {ObjectId} = Schema.Types

const Comment = new Schema({
    text: {
        type:String,
        required: true,
    },
    postedOn:  {
        type:Date,
        default: Date.now
    },
    likes: [ {
        type:ObjectId,
        ref:"users"
    },],
})


const messages = new Schema({
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }, 
    from: {
        type: ObjectId,
        ref: "users",
        required: true

    },
    to: {
        type: ObjectId,
        ref: "users",
        required: true

    },
    isJoinReq:  {
        type:Boolean,
        deafult: false
    },
    status:  {
        type:String,
    },
    type:{
        type:String,
    required:true,
}

})

const MessagesModel = mongoose.model("messages", messages)


module.exports = MessagesModel