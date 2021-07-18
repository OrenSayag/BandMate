const router = require('express').Router()
const GenresModel = require("../DB/models/genres")

router.get("/", async (req,res)=>{
    const genres = await GenresModel.find()
    return res.status(200).send({genres})
})

// router.post("/", async (req,res)=>{
//     const genres = await GenresModel.find()
//     return res.status(200).send({genres})
// })

module.exports = router
