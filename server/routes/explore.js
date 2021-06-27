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

module.exports = router
