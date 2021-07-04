const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types



const audio = new Schema({
    _id:String,
    length:Number,
    chunkSize:Number,
    uploadDate:Date,
    filename:String,
    md5:String,
    contentType:String,
})

const AudioModel = mongoose.model("fs.chunks", audio)

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






module.exports = AudioModel