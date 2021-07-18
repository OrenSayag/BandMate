const UsersModel = require("./DB/models/users");


const privateGuard = async (content, userId) => {
    let participants = await UsersModel.findById(content.parentUser)
    participants = participants.participants
    console.log(userId)
    console.log(content.parentUser)
    console.log(participants)
    if(
      content.isPrivate && ((userId!=content.parentUser.toString()) &&
     !(participants.some(p=>p.userId==userId)))
    ){
      console.log("content is private, and user is not the contents parent user or a participant")
      return false
    } else {
      // console.log("you can comment")
      return true
    }
  
  }


  module.exports = {
      privateGuard,

  }