const LogsModel = require('../DB/models/logs')
const RecordingsModel = require('../DB/models/recordings')
const PostsModel = require('../DB/models/posts')
const UsersModel = require('../DB/models/users')

const router = require('express').Router()

// gets top data based on likes
router.get("/", async (req, res)=>{
    const { filter } = req.body

    try {
        // from each content model, get the first hundred logs and sort by amount of likes.
        // concat all top data into one
        const allLogs = await LogsModel.find()
        const allRecordings = await RecordingsModel.find()
        const allPosts = await PostsModel.find()

        const hugeExplore = {
            allLogs,
            allRecordings,
            allPosts
        }

        let filteredData = []

        switch (filter) {
            case "bands":
                // get top bands based on followers. (or all as we start)
                filteredData = await UsersModel.find({isBand:true}, {
                    "hashedPass":0,
                    "logCategories":0,
                    "mail":0,
                })
                break;
        
            default:
                break;
        }



        return res.status(200).send({hugeExplore, filteredData})
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }

})

// gets an individual content data
router.get("/:id", async (req, res)=>{
    const { id } = req.params

    try {
        const log = await LogsModel.findById(id)
        const post = await PostsModel.findById(id)
        const recording = await RecordingsModel.findById(id)
        if(log){
            return res.status(200).send(log)
        } else if(post) {
            return res.status(200).send(post)
        } else if(recording) {
            return res.status(200).send(recording)
        } 

        return res.status(200).send({fail:"No such content"})
    } catch (error) {
        console.log(error)
        return res.status(500).send("send normal mongo id")
    }

})

// gets an list of matches based on search value
router.get("/search/:value", async (req, res)=>{
    const { value } = req.params
console.log(value)
    try {
    const logs = await LogsModel.find({"title": {"$regex":value}})
        const posts = await PostsModel.find({"title":{"$regex":value}, "content":{"$regex":value}})
        const recordings = await RecordingsModel.find({"title":{"$regex":value}})
 
        return res.status(200).send({logs, posts, recordings})
    } catch (error) {
        console.log(error)
        return res.status(500)
    }

})

module.exports = router
