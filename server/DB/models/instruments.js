const mongoose = require("mongoose")
const Schema = mongoose.Schema

const instruments = new Schema({
    name:String,
    img_src:String
})

const instrumentModel = mongoose.model("instruments", instruments)

module.exports = instrumentModel