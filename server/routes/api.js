const router = require('express').Router()
const jwt = require("jsonwebtoken");
require('dotenv').config()


// oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo  .oooooo..o 
// `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' d8P'    `Y8 
//  888          888       8   8 `88b.    8  888               888       888  888      888  8 `88b.    8  Y88bo.      
//  888oooo8     888       8   8   `88b.  8  888               888       888  888      888  8   `88b.  8   `"Y8888o.  
//  888    "     888       8   8     `88b.8  888               888       888  888      888  8     `88b.8       `"Y88b 
//  888          `88.    .8'   8       `888  `88b    ooo       888       888  `88b    d88'  8       `888  oo     .d8P 
// o888o           `YbodP'    o8o        `8   `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  8""88888P'  
const verifyUser = async (req,res,next) => {
    try {
        const payload = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET)
        req.userInfo = payload.userInfo
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).send("Invalid token")
    }

}
const verifyAdmin = (req,res,next) => {
    const payload = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET)
    if(!payload){
        return res.status(401).send({fail:"Invalid token"})
    }
    let userInfo=payload.userInfo
    if(userInfo.type!=='admin'){
        return res.status(401).send({fail:"you're not an admin"})
    }
    req.userInfo = userInfo
    next()
}


router.use("/auth", require("../routes/auth"))
router.use("/logs", verifyUser ,require("../routes/logs"))
router.use("/user" ,require("../routes/user"))
router.use("/genres" ,require("../routes/genres"))
router.use("/explore" ,require("../routes/explore"))



module.exports = router