const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Participant = new Schema({
    username:String,
    role:String
})

const LogCategory = new Schema({
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
    instruments: [String],
    followers: [String],
    following: [String],
    bio: String,
    recordings: [String],
    posts: [String],
    logs: [String],
    bands: [String],
    genres: [String],
    isBand: Boolean,
    participants: [Participant],
    likedLogs: [String],
    likedRecordings: [String],
    likedPosts: [String],
    logCategories: [LogCategory],
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