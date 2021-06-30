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
  } = req.body;

  if (!timeInMins || !instruments || !title || !isPrivate) {
    return res.status(400).send({ fail: "missing some info" });
  }

  if (!date) {
    date = new Date();
  }

  try {
    const user = await UsersModel.find({ _id: id });
    if(user.length===0){
        return res.status(400).send({fail:"no such user"})
    }

    const newLog = await new LogsModel({
      timeInMins,
      instruments,
      categories,
      title,
      ratingStars,
      users,
      parentUser: id,
      date,
      isPrivate,
    });

    await newLog.save();

    return res.sendStatus(201);
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
    const log = await LogsModel.find({ _id: id });

    if (log.length === 0) {
      return res.status(400).send({ fail: "No such log" });
    }

    let user = await UsersModel.find({ _id: userId });
    user = user[0];

    if(log.isPrivate && (log.parentUser!==userId && !log.users.some(user=>user.id===userId))){
        return res.status(400).send({ fail: "You shouldn't even see this log" });
    }

    await UsersModel.findOneAndUpdate(
      { _id: userId },
      { $push: { likedLogs: log[0]._id } }
    );

    return res.sendStatus(200);
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
    let log = await LogsModel.find({ _id: id });

    if (log.length === 0) {
      return res.status(400).send({ fail: "No such log" });
    }

    log = log[0];

    if(log.isPrivate && (log.parentUser!==userId && !log.users.some(user=>user.id===userId))){
        return res.status(400).send({ fail: "You shouldn't even see this log" });
    }

    await LogsModel.findOneAndUpdate({ _id: id }, { $push: { comments: {
        username: req.userInfo.username,
        userId,
        text,
        postedOn: new Date(),
    } } });

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete comment from log
router.delete("/comment/:logId/:commentId", async (req, res) => {
  const { logId, commentId } = req.params;
  const userId = req.userInfo.id;

  if (!logId, !commentId) {
    return res.status(400).send({ fail: "Missing some info" });
  }

  try {
    let log = await LogsModel.find({ _id: logId });

    if (log.length === 0) {
      return res.status(400).send({ fail: "No such log" });
    }

    log = log[0];

    const comment = log.comments.find(comment=>comment.id===commentId)
    if(!comment){
           
        return res.status(400).send({"fail":"No such comment on this log"})
    }
    if(comment.userId!==userId){
        return res.status(400).send({"fail":"This isn't your comment"})
    }

    await LogsModel.findOneAndUpdate({ _id: logId }, { $pull: { comments: {
        _id: commentId
    } } });

    return res.sendStatus(202);
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

  if (!logId || !newRating) {
    return res.status(400).send({ fail: "Missing some info" });
}

if(newRating < 0 || newRating > 5){
    
    return res.status(400).send({ fail: "Invalid rating rate between 0 and 5" });
  }

  try {
    let log = await LogsModel.find({ _id: logId });

    if (log.length === 0) {
      return res.status(400).send({ fail: "No such log" });
    }
    
    log = log[0];
    
    if((log.parentUser!==userId && !log.users.some(user=>user.id===userId))){
        return res.status(400).send({ fail: "Only users of this log can rate it" });
    }
    
    await LogsModel.findOneAndUpdate({_id:logId}, {ratingStars: Math.floor(newRating)})

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete log
router.delete("/:logId", async (req, res) => {
  const { logId } = req.params;
  const userId = req.userInfo.id;

  if (!logId) {
    return res.status(400).send({ fail: "Missing some info" });
  }

  try {
    let log = await LogsModel.find({ _id: logId });

    if (log.length === 0) {
      return res.status(400).send({ fail: "No such log" });
    }
    
    log = log[0];
    
    if(log.parentUser!==userId){
        return res.status(400).send({ fail: "This log is not yours to delete" });
    }

    await LogsModel.remove({ _id: logId });

    return res.sendStatus(202);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
