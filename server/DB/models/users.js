const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types


const Participant = new Schema({
    userId:{
        type: ObjectId,
        ref:"users"
    },
    role:{
        type:String,
        default: "member"
    },
    instruments: [{
        type: ObjectId,
        ref:"instruments",
        // required:true,
    }]
})

const ContentCategory = new Schema({
    name:String,
    color:String
})

const users = new Schema({
    username:String,
    fname:String,
    lname: String,
    mail: String,
    hashedPass: String,
    profile_img_src: String,
    cover_img_src: String,
    instruments: [{
        type: ObjectId,
        ref:"instruments"
    }],
    followers: [{
        type: ObjectId,
        ref:"users"
    }],
    following: [{
        type: ObjectId,
        ref:"users"
    }],
    // bio: String,
    // recordings: [{
    //     type: ObjectId,
    //     ref:"recordings"
    // }],
    // posts: [{
    //     type: ObjectId,
    //     ref:"posts"
    // }],
    // logs: [{
    //     type: ObjectId,
    //     ref:"logs"
    // }],
    bands: [{
        type: ObjectId,
        ref:"users"
    }],
    genres: [{
        type: ObjectId,
        ref:"genres"
    }],
    isBand: Boolean,
    participants: [Participant],
    likedLogs: [{
        type: ObjectId,
        ref:"logs"
    }],
    likedRecordings: [{
        type: ObjectId,
        ref:"recordings"
    }],
    likedPosts: [{
        type: ObjectId,
        ref:"posts"
    }],
    logCategories: [ContentCategory],
    bankCategories: [ContentCategory],
    isAdmin: Boolean,
})

const UsersModel = mongoose.model("users", users, "users")

// const test = new UsersModel({
//     username: "member1",
//     fname: "member1",
//     lname: "member1",
//     mail: "member1@member1.com",
//     hashedPass: "1234",
//     instruments: ["BUG!", "BUIG2"],
//     participants: [{username:"test", role:"band-admin", balh: "blah"}]



// })

// test.save()






module.exports = UsersModel