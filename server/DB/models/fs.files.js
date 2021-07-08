const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types


const schema = new Schema({

})

const FsFilesModel = mongoose.model("fs.files", schema)


module.exports = FsFilesModel