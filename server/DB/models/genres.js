const mongoose = require("mongoose")
const Schema = mongoose.Schema

const genres = new Schema({
    name:String,
    img_src:String
})

const GenresModel = mongoose.model("genres", genres)

module.exports = GenresModel