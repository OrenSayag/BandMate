require("./DB/connection")
require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 443
const https = require('https')
const fs = require('fs');
// const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');




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


//define static folder
app.use("/", express.static(__dirname + "/dist/client"))

app.use('/api', require('./routes/api'))

app.get("/*", (req, res)=>{
  // res.sendFile(path.join(__dirname, 'build', 'index.html'))
  res.sendFile(__dirname + '/dist/client/index.html')
})

// app.listen(port, (err)=>{
//     if(err){console.log(err)}
//     console.log(`Server is running on ${port}`)
// })
https.createServer({
  // key: fs.readFileSync('server.key'),
  // cert: fs.readFileSync('server.cert')
  key: fs.readFileSync('./ssh/server.key'),
  cert: fs.readFileSync('./ssh/server.crt')
}, app)
.listen(port, (err)=>{
    if(err){console.log(err)}
    console.log(`Server is running on ${port}`)
})