const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types


const schema = new Schema({

})

const FsChunksModel = mongoose.model("fs.chunks", schema)


module.exports = FsChunksModel