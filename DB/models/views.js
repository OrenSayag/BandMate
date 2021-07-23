const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types


const viewsSchema = new Schema({
    siteViews:Number
})

const ViewsModel = mongoose.model("views", viewsSchema, "views")

module.exports = ViewsModel