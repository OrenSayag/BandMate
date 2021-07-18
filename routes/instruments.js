const router = require('express').Router()
const GenresModel = require("../DB/models/genres")
const instrumentModel = require('../DB/models/instruments')

// gets all instruments in app and also the chosen insrtuments of user
router.get("/", async (req,res)=>{
    const instruments = await instrumentModel.find()

    return res.status(200).send({instruments})
})



module.exports = router
