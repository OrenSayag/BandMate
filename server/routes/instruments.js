const router = require('express').Router()
const GenresModel = require("../DB/models/genres")
const instrumentModel = require('../DB/models/instruments')

router.get("/", async (req,res)=>{
    const instruments = await instrumentModel.find()
    return res.status(200).send({instruments})
})



module.exports = router
