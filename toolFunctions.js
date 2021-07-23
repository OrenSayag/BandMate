const UsersModel = require("./DB/models/users");
const ViewsModel = require("./DB/models/views");

const privateGuard = async (content, userId) => {
  let participants = await UsersModel.findById(content.parentUser);
  participants = participants.participants;
  console.log(userId);
  console.log(content.parentUser);
  console.log(participants);
  if (
    content.isPrivate &&
    userId != content.parentUser.toString() &&
    !participants.some((p) => p.userId == userId)
  ) {
    console.log(
      "content is private, and user is not the contents parent user or a participant"
    );
    return false;
  } else {
    // console.log("you can comment")
    return true;
  }
};

const siteViewsIncrement = async (req, res, next) => {
  const ip = req.connection.remoteAddress;
  // if(ip==="my windows or phone"){
  if(ip=="::ffff:31.168.222.174" || ip=="::ffff:188.64.206.187"){
    console.log("New connection from my windows or phone; views are not incremented")
    return next()
  }

  
  await ViewsModel.findByIdAndUpdate("60fac650aeda3fa0eab208b5", {
    // const siteViews = await ViewsModel.findByIdAndUpdate("60fac457a43ddd00001ac6a7", {
      $inc: {
        siteViews: 1
      }
    })
    .catch((err)=>{console.log(err)})
    
    console.log("New connection from ip " + req.connection.remoteAddress 
    + " | at " + new Date() 
    + " | Site Views: " 
    + siteViews.siteViews)

  next()
}

module.exports = {
  privateGuard,
  siteViewsIncrement,
};
