const UsersModel = require("../DB/models/users");
const LogsModel = require("../DB/models/logs");

const router = require("express").Router();

// get users logs
router.get("/", async (req, res) => {
  const { id } = req.userInfo;
  try {
    const userLogs = await LogsModel.find({
      // $or:[
        // {parentUser:id},
        parentUser:id
      // ]
    }).populate({
      path:"parentUser",
      select:"username"
    }).populate({
      path:"instruments",
    })
    return res.status(200).send({ userLogs });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// post new log
router.post("/", async (req, res) => {
  const { id } = req.userInfo;
  let {
    timeInMins,
    instruments,
    categories,
    title,
    ratingStars,
    users,
    date,
    isPrivate,
    bandId
  } = req.body;

  if (!timeInMins || !instruments || isPrivate===undefined) {
    console.log(req.body)
    return res.status(400).send({ fail: "missing some info" });
  }

  
  try {
    let user = await UsersModel.findById(id);

    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){
  
        return res.status(400).send({"fail":"You're not in this band brother."})
      }
      //  else {
      //   user = await UsersModel.findById(bandId)
      // }
    }

    let parentUser;

    if(bandId&&id!=bandId){
        parentUser = bandId
      } else {
      parentUser = id
    }

    const newLog = await new LogsModel({
      timeInMins,
      instruments,
      categories,
      title,
      ratingStars,
      users,
      parentUser,
      date,
      isPrivate,
    });
    


    await newLog.save();
    
    return res.status(201).send({ok:"successfully created a log! for the user/band " + user.username});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// like log
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfo.id;
  try {
    // find log, add to user's liked logs array
    const log = await LogsModel.findById( id );

    if (!log) {
      return res.status(400).send({ fail: "No such log" });
    }

    if(log.isPrivate){
      const parentUser = await UsersModel.findById(log.parentUser)
      if((log.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

        return res.status(400).send({ fail: "You shouldn't even see this log (not parentUser or participant)" });
      }
    }

    
    if(log.likes.some(u=>u==userId)){
      await LogsModel.findByIdAndUpdate(
        id ,
        { $pull: { likes: userId } }
        );
        await UsersModel.findByIdAndUpdate(
           userId ,
          { $pull: { likedLogs: log._id } }
        );
      } else {
      await UsersModel.findByIdAndUpdate(
         userId ,
        { $push: { likedLogs: log._id } }
      );
      await LogsModel.findByIdAndUpdate(
         id ,
        { $push: { likes: userId } }
      );
    }
    console.log("liking")



    return res.status(200).send({ok:"un/liked log"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// post comment on log
router.post("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.userInfo.id

  if (!text || !id) {
    return res.status(400).send({ fail: "Missing some info" });
  }

  try {
    let log = await LogsModel.findById( id );

    if (!log) {
      return res.status(400).send({ fail: "No such log" });
    }

    if(log.isPrivate){
      const parentUser = await UsersModel.findById(log.parentUser)
      if((log.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

        return res.status(400).send({ fail: "You shouldn't even see this log (not parentUser or participant)" });
      }
    }

    // if(log.isPrivate && (log.parentUser!==userId && !log.users.some(user=>user.id===userId))){
    //     return res.status(400).send({ fail: "You shouldn't even see this log" });
    // }

    await LogsModel.findByIdAndUpdate(id, { $push: { comments: {
        userId,
        text,
    } } });

    return res.status(201).send({"ok":"posted new comment on this log"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete comment from log
router.delete("/comment/:logId/:commentId", async (req, res) => {
  const { logId, commentId } = req.params;
  const userId = req.userInfo.id;

  if (!logId || !commentId) {
    return res.status(400).send({ fail: "Missing some info" });
  }

  try {
    let log = await LogsModel.findById(  logId );

    if (!log) {
      return res.status(400).send({ fail: "No such log" });
    }

    const comment = log.comments.find(comment=>comment.id==commentId)
    if(!comment){
           
        return res.status(400).send({"fail":"No such comment on this log"})
    }
    if(comment.userId!=userId){
        return res.status(400).send({"fail":"This isn't your comment"})
    }

    await LogsModel.findByIdAndUpdate( logId , { $pull: { comments: {
        _id: commentId
    } } });

    return res.status(200).send({"ok":"Successfuly deleted comment of this log"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// rate log
router.put("/rate/:logId", async (req, res) => {
  const { logId } = req.params;
  const userId = req.userInfo.id;
  const {newRating} = req.body

  console.log(logId)
  console.log(newRating)

  if (!logId || newRating===undefined) {
    return res.status(400).send({ fail: "Missing some info" });
}

if(newRating < 0 || newRating > 5){
    
    return res.status(400).send({ fail: "Invalid rating rate between 0 and 5" });
  }

  try {
    let log = await LogsModel.findById( logId );

    if (!log) {
      return res.status(400).send({ fail: "No such log" });
    }

    const parentUser = await UsersModel.findById(log.parentUser)
    if((log.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

      return res.status(400).send({ fail: "Only parentuser or participants can rate content" });
    }
    
    // *** keep in mind for an opt multiple user logs feature
    // if((log.parentUser!=userId && !log.users.some(user=>user.id===userId))){
    //     return res.status(400).send({ fail: "Only users of this log can rate it" });
    // }
    
    await LogsModel.findByIdAndUpdate(logId, {ratingStars: Math.floor(newRating)})

    return res.send({"ok":"successfully rated log!"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete log
router.delete("/:logId", async (req, res) => {
  const { logId } = req.params;
  const userId = req.userInfo.id;

  // if (!logId) {
  //   return res.status(400).send({ fail: "Missing some info" });
  // }

  try {
    let log = await LogsModel.find({ _id: logId });

    if (log.length === 0) {
      return res.status(400).send({ fail: "No such log" });
    }
    
    log = log[0];

    const parentUser = await UsersModel.findById(log.parentUser)
    if((log.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

      return res.status(400).send({ fail: "This log is not yours to delete" });
    }
    
    // if(log.parentUser!=userId){
    //     return res.status(400).send({ fail: "This log is not yours to delete" });
    // }

    await LogsModel.remove({ _id: logId });

    return res.status(200).send({"ok":"successfully deleted this log"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
