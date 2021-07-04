require("./DB/connection")
require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 666





// ooo        ooooo ooooo oooooooooo.   oooooooooo.   ooooo        oooooooooooo oooooo   oooooo     oooo       .o.       ooooooooo.   oooooooooooo 
// `88.       .888' `888' `888'   `Y8b  `888'   `Y8b  `888'        `888'     `8  `888.    `888.     .8'       .888.      `888   `Y88. `888'     `8 
//  888b     d'888   888   888      888  888      888  888          888           `888.   .8888.   .8'       .8"888.      888   .d88'  888         
//  8 Y88. .P  888   888   888      888  888      888  888          888oooo8       `888  .8'`888. .8'       .8' `888.     888ooo88P'   888oooo8    
//  8  `888'   888   888   888      888  888      888  888          888    "        `888.8'  `888.8'       .88ooo8888.    888`88b.     888    "    
//  8    Y     888   888   888     d88'  888     d88'  888       o  888       o      `888'    `888'       .8'     `888.   888  `88b.   888       o 
// o8o        o888o o888o o888bood8P'   o888bood8P'   o888ooooood8 o888ooooood8       `8'      `8'       o88o     o8888o o888o  o888o o888ooooood8 
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type', 'authorization', 'responsetype', 'access-control-allow-methods', 'access-control-allow-origin', 'access-control-allow-headers', ],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}))
app.use(express.json())



// ooooooooo.     .oooooo.   ooooo     ooo ooooooooooooo oooooooooooo  .oooooo..o 
// `888   `Y88.  d8P'  `Y8b  `888'     `8' 8'   888   `8 `888'     `8 d8P'    `Y8 
//  888   .d88' 888      888  888       8       888       888         Y88bo.      
//  888ooo88P'  888      888  888       8       888       888oooo8     `"Y8888o.  
//  888`88b.    888      888  888       8       888       888    "         `"Y88b 
//  888  `88b.  `88b    d88'  `88.    .8'       888       888       o oo     .d8P 
// o888o  o888o  `Y8bood8P'     `YbodP'        o888o     o888ooooood8 8""88888P'                                           
app.get('/', function (req, res) {
    res.send('Hello World')
})
app.use('/api', require('./routes/api'))



// app.use('/profile', verifyUser ,require('./routes/profile'))
// app.use('/controlPanel', verifyAdmin, require('./routes/controlPanel'))
// app.use('/inbox', require('./routes/inbox'))
// app.use('/explore', require('./routes/explore'))
// app.use('/location', verifyUser ,require('./routes/location'))
// app.use('/vacation', verifyUser ,require('./routes/vacation'))
// app.use('/club', verifyUser ,require('./routes/club'))
// app.use('/pay', verifyUser ,require('./routes/pay'))
// app.use('/blog' ,require('./routes/blog'))
// app.get('/newToken', verifyUser, (req, res)=>{
//     const userInfo = req.userInfo
//     res.status(200).send({userInfo})
// })
 
app.listen(port, (err)=>{
    if(err){console.log(err)}
    console.log(`Server is running on ${port}`)
})