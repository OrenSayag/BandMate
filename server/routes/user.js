const UsersModel = require("../DB/models/users");
const LogsModel = require("../DB/models/logs");
const jwt = require("jsonwebtoken");
const RecordingsModel = require("../DB/models/recordings");
const PostsModel = require("../DB/models/posts");
const router = require("express").Router();
const mongoose = require("mongoose")

// oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo  .oooooo..o
// `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' d8P'    `Y8
//  888          888       8   8 `88b.    8  888               888       888  888      888  8 `88b.    8  Y88bo.
//  888oooo8     888       8   8   `88b.  8  888               888       888  888      888  8   `88b.  8   `"Y8888o.
//  888    "     888       8   8     `88b.8  888               888       888  888      888  8     `88b.8       `"Y88b
//  888          `88.    .8'   8       `888  `88b    ooo       888       888  `88b    d88'  8       `888  oo     .d8P
// o888o           `YbodP'    o8o        `8   `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  8""88888P'
const verifyUser = async (req, res, next) => {
  try {
    const payload = jwt.verify(
      req.headers.authorization,
      process.env.TOKEN_SECRET
    );
    req.userInfo = payload.userInfo;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid token");
  }
};

router.get("/", (req, res) => {
  return res.send("test");
});

// get users info
router.get("/info/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UsersModel.find({ _id: id });
    const publicUserInfo = {
      profile_img_src: user[0].profile_img_src,
      username: user[0].username,
      fname: user[0].fname,
      lname: user[0].lname,
      cover_img_src: user[0].cover_img_src,
      instruments: user[0].instruments,
      followers: user[0].followers,
      following: user[0].following,
      bio: user[0].bio,
      isBand: user[0].isBand,
      participants: user[0].participants,
    };
    return res.status(200).send({ publicUserInfo });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get user instruments
router.post("/instruments", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { bandId } = req.body;
  try {
    let user = await UsersModel.findById(id).populate("instruments");
    if(id!=bandId){
      if(bandId){
        if(!user.bands.some(b=>b==bandId)){
  
          return res.status(400).send({"fail":"You're not in this band brother."})
        } else {
          user = await UsersModel.findById(bandId).populate("instruments")
        }
      }
    }
    return res.status(200).send({ ok:user.instruments });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// add to user instruments
router.post("/instruments/:instrumentId", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { instrumentId } = req.params;
  const { bandId } = req.body;
  try {
    let user = await UsersModel.findById(id);
    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){

        return res.status(400).send({"fail":"You're not in this band brother."})
      } else {
        user = await UsersModel.findById(bandId)
      }
    }

    if(user.instruments.some(i=>i==instrumentId)){
      if(bandId && (id!=bandId)){
        return res.status(400).send({"fail":"Instrument already of band"})
      }
      return res.status(400).send({"fail":"Instrument already of user"})
    }
    if(bandId && (id!=bandId)){
      await UsersModel.findByIdAndUpdate(bandId, {
        $push:{
          instruments: instrumentId
        }
      })
    } else {
      await UsersModel.findByIdAndUpdate(id, {
        $push:{
          instruments: instrumentId
        }
      })
    }
    return res.status(200).send({ ok:"ok" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete user instrument
router.post("/instruments/delete/:instrumentId", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { instrumentId } = req.params;
  const { bandId } = req.body;

  try {

    let user = await UsersModel.findById(id)
    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){

        return res.status(400).send({"fail":"You're not in this band brother."})
      } else {
        user = await UsersModel.findById(bandId)
      }
    }
    if(user.instruments.length===1){
      return res.status(400).send({"fail":"You have to have atleast one instrument"})
    }
  if(bandId && (id!=bandId)){
      await UsersModel.findByIdAndUpdate(bandId, {
        $pull:{
          instruments: instrumentId
        }
      })
    } else {
      await UsersModel.findByIdAndUpdate(id, {
        $pull:{
          instruments: instrumentId
        }
      })
    }
  if(bandId && (id!=bandId)){
    return res.status(200).send({ ok:"deleted instrument from band" });
  } 
  return res.status(200).send({ ok:"deleted instrument from user" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get log categories of user
router.get("/logCategories", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  try {
    const user = await UsersModel.find({ _id: id });
    const logCategories = user[0].logCategories;
    return res.status(200).send({ logCategories });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// add log category to user
router.post("/logCategories", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { newCategory, bandId } = req.body;

  if (!newCategory) {
    return res.status(400).send("Missing some info");
  }

  try {
    let user = await UsersModel.findById(id);
    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){

        return res.status(400).send({"fail":"You're not in this band brother."})
      } else {
        user = await UsersModel.findById(bandId)
      }
    }
    if (
      user.logCategories.some((category) => category.name === newCategory.name)
    ) {
      return res.status(400).send({ fail: "Cannot add duplicate categories" });
    }

    if(bandId&&id!=bandId){
      await UsersModel.findByIdAndUpdate(
        bandId,
        {
          $push: {
            logCategories: { name: newCategory.name, color:newCategory.color },
          },
        }
      );
    } else {
      await UsersModel.findByIdAndUpdate(
        id,
        {
          $push: {
            logCategories: { name: newCategory.name, color:newCategory.color },
          },
        }
      );
    }

    return res.status(201).send({ok:"added a new category"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// deletes a log category
router.post("/logCategories/:catName", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { catName } = req.params;
  const { bandId } = req.body
console.log(bandId)

  try {
    let user = await UsersModel.findById(  id );
    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){

        return res.status(400).send({"fail":"You're not in this band brother."})
      } else {
        user = await UsersModel.findById(bandId)
      }
    }

    const cat = user.logCategories.find(c=>c.name===catName)
    
    if (!cat) {
      return res.status(400).send({ fail: "no such category" });
    }

    if(bandId&&id!=bandId){
      await UsersModel.findByIdAndUpdate(
        bandId,
        {
       $pull:{
        logCategories:{name:catName}
      }
        }
      );
    } else {
      await UsersModel.findByIdAndUpdate(
        id,
        {
         $pull:{
        logCategories:{name:catName}
      }
        }
      );
    }
    

    return res.status(200).send({ok:"removed this category"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get recording categories of user
router.get("/bankCategories", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  try {
    const user = await UsersModel.find({ _id: id });
    const bankCategories = user[0].bankCategories;
    return res.status(200).send({ bankCategories });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// add log category to user
router.post("/bankCategories", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { newCategory, bandId } = req.body;

  if (!newCategory) {
    return res.status(400).send("Missing some info");
  }

  try {
    let user = await UsersModel.findById(id);
    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){

        return res.status(400).send({"fail":"You're not in this band brother."})
      } else {
        user = await UsersModel.findById(bandId)
      }
    }
    if (
      user.bankCategories.some((category) => category.name === newCategory.name)
    ) {
      return res.status(400).send({ fail: "Cannot add duplicate categories" });
    }

    if(bandId&&id!=bandId){
      await UsersModel.findByIdAndUpdate(
        bandId,
        {
          $push: {
            bankCategories: { name: newCategory.name, color:newCategory.color },
          },
        }
      );
    } else {
      await UsersModel.findByIdAndUpdate(
        id,
        {
          $push: {
            bankCategories: { name: newCategory.name, color:newCategory.color },
          },
        }
      );
    }

    return res.status(201).send({ok:"added a new category"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// deletes a log category
router.post("/bankCategories/:catName", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { catName } = req.params;
  const { bandId } = req.body
console.log(bandId)

  try {
    let user = await UsersModel.findById(  id );
    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){

        return res.status(400).send({"fail":"You're not in this band brother."})
      } else {
        user = await UsersModel.findById(bandId)
      }
    }

    const cat = user.bankCategories.find(c=>c.name===catName)
    
    if (!cat) {
      return res.status(400).send({ fail: "no such category" });
    }

    if(bandId&&id!=bandId){
      await UsersModel.findByIdAndUpdate(
        bandId,
        {
       $pull:{
        bankCategories:{name:catName}
      }
        }
      );
    } else {
      await UsersModel.findByIdAndUpdate(
        id,
        {
         $pull:{
        bankCategories:{name:catName}
      }
        }
      );
    }
    

    return res.status(200).send({ok:"removed this category"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get the user's feed
router.post("/personalInfo", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { bandId } = req.body;

  try {
    let user;
    // let myParticipants = []
    user = await UsersModel.findById(id).populate("participants.userId").populate("bands").populate("instruments");
    if (bandId) {
      const band = await UsersModel.findById(bandId);
      // for (const p of band.participants) {
      //   myParticipants.push(p.userId)
      // }
      if (!band.participants.some((p) => p.userId == id) && band._id != id) {
        return res
          .status(400)
          .send({ fail: "You're not in this band brother." });
      } 
      else {
        user = await UsersModel.findById(bandId).populate("participants.userId").populate("bands").populate("instruments");
      }
    }

    // console.log(bandId)

    // associated users are: participants of the band, or participants of
    // a band that a user is in.
    const myBandMates = [];
    for (const band of user.bands) {
      const aBand = await UsersModel.findById(band).populate("participants.userId");
      for (const p of aBand.participants) {
        myBandMates.push(p);
      }
    }
    // console.log(user.bands);
    
    const associatedUsers = [...user.participants, ...myBandMates];
    const myContent = {
      logs: await LogsModel.find({
        $or: [{ parentUser: {$in:[user._id]} } ,{ users: user._id },],
      }).populate("instruments").populate({path:"parentUser", select:"profile_img_src _id participants username"})
      .populate({path:"comments.userId", select:"username profile_img_src"})
      ,
      recordings: await RecordingsModel.find({
        $or: [{ parentUser: {$in:[user._id]} } ,{ users: user._id },],
      }).populate("instruments").populate({path:"parentUser", select:"profile_img_src _id participants username"})
      .populate({path:"comments.userId", select:"username profile_img_src"})
      ,
      // posts: await PostsModel.find({ parentUser: id }),
      posts: await PostsModel.find({ parentUser: {$in:[user._id]} }).populate("instruments").populate({path:"parentUser", select:"profile_img_src _id participants username"})
      .populate({path:"comments.userId", select:"username profile_img_src"})
      ,
    };


    return res.status(200).send({ associatedUsers, myContent, userOrHisBand: user });
    // return res.status(200).send({  logs:myContent.logs });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get the user's feed
router.post("/feed", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { filter } = req.body;

  console.log(req.userInfo.username);

  try {
    let user = await UsersModel.find({ _id: id });
    user = user[0];

    // here I need to implement functions that get:
    // content is: posts, logs, recordings
    // - all user's content
    const userContent = {
      logs: await LogsModel.find({ parentUser: id }).populate({
        path:"parentUser",
        select: "username isBand"
      }),
      posts: await PostsModel.find({ parentUser: id }).populate({
        path:"parentUser",
        select: "username isBand"
      }),
      recordings: await RecordingsModel.find({ parentUser: id }).populate({
        path:"parentUser",
        select: "username isBand"
      }),
    };

    const bandContent = {};
    for (const band of user.bands) {
      const logs = await LogsModel.find({ parentUser: band }).populate({
        path:"parentUser",
        select: "username isBand"
      });
      const posts = await PostsModel.find({ parentUser: band }).populate({
        path:"parentUser",
        select: "username isBand"
      });
      const recordings = await RecordingsModel.find({ parentUser: band }).populate({
        path:"parentUser",
        select: "username isBand"
      });
      bandContent.logs = logs;
      bandContent.posts = posts;
      bandContent.recordings = recordings;
    }

    // - all the people who the user is follwing's content that is not private
    const followingContent = {
      logs: await LogsModel.find({ parentUser: { $in: user.following } }).populate({
        path:"parentUser",
        select: "username isBand"
      }),
      posts: await PostsModel.find({ parentUser: { $in: user.following } }).populate({
        path:"parentUser",
        select: "username isBand"
      }),
      recordings: await RecordingsModel.find({
        parentUser: { $in: user.following },
      }).populate({
        path:"parentUser",
        select: "username isBand"
      }),
    };
    // everything should be ordered by date desc.
    let hugeFeed = [].concat(
      userContent.logs,
      userContent.posts,
      userContent.recordings,
      followingContent.logs,
      followingContent.posts,
      followingContent.recordings,
      bandContent.logs,
      bandContent.posts,
      bandContent.recordings
    );
    hugeFeed.sort((a, b) => a.date - b.date);

    let organizedFeed = {
      logs: [
        ...userContent.logs.sort((a, b) => a.date - b.date),
        ...followingContent.logs.sort((a, b) => a.date - b.date),
        ...bandContent.logs.sort((a, b) => a.date - b.date),
      ],
      posts: [
        ...userContent.posts.sort((a, b) => a.date - b.date),
        ...followingContent.posts.sort((a, b) => a.date - b.date),
        ...bandContent.posts.sort((a, b) => a.date - b.date),
      ],
      recordings: [
        ...userContent.recordings.sort((a, b) => a.date - b.date),
        ...followingContent.recordings.sort((a, b) => a.date - b.date),
        ...bandContent.recordings.sort((a, b) => a.date - b.date),
      ],
    };

    // filter option: filters the content based on content type.
    // not doing this now.

    return res.status(200).send({ userFeed: hugeFeed, organizedFeed });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// user follow user
router.put('/follow/:toFollowId', verifyUser ,async (req, res)=>{
  const {id} = req.userInfo
  const {toFollowId} = req.params
  try {
    const toFollowUser = await UsersModel.findById(toFollowId)
    if(!toFollowUser){
      return res.status(400).send({fail:"No such user"})
    }
    // await UsersModel.findByIdAndUpdate(id, {$set:{following:[]}})
    if(id==toFollowId){
      return res.status(400).send({fail:"Don't follow yourself."})
    }
    const user = await UsersModel.findById(id)
    if(user.following.some(followed=>followed==toFollowId)){
      // console.log("push")
      await UsersModel.findByIdAndUpdate(id, {
        $pull: {
          following: toFollowId
        }
      })
    } else {
      // console.log("pull")
      await UsersModel.findByIdAndUpdate(id, {
        $push: {
          following: toFollowId
        }
      })
    }
    return res.status(200).send({ok:await UsersModel.findById(id)})
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

// userInfo (of token holder)
router.get('/tokenHolderInfo', verifyUser ,async (req, res)=>{
  const {id} = req.userInfo
  try {
    
    const userInfo = await UsersModel.findById(id)
    .populate({
      select:"username",
      path:"bands"
    })
    .populate({
      path:"instruments"
    })
    .populate({
      path:"genres"
    })
    return res.status(200).send({ok:userInfo})
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})





module.exports = router;
