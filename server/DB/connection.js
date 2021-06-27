const mongoose = require("mongoose")
const Instruments = require("./models/instruments")
const UsersModel = require("./models/users")

mongoose.connect(`mongodb://localhost:27017/bandmate`)

mongoose.connection.once(`open`, ()=>{
    console.log('The goose is loose')
}).on("error", (error)=>{
    console.log(error)
})


// const user1 = new Instruments({name:"guitar", img_src:""})
// // user1.save()
// Instruments.deleteMany({}, ()=>{
//     console.log("I said remove them all!!")
// })