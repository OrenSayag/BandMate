const UsersModel = require("../DB/models/users");
const LogsModel = require("../DB/models/logs");
const jwt = require("jsonwebtoken");
const RecordingsModel = require("../DB/models/recordings");
const PostsModel = require("../DB/models/posts");
const router = require("express").Router();

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

// change log categories of user
router.post("/logCategories", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { newCategory } = req.body;

  if (!newCategory) {
    return res.status(400).send("Missing some info");
  }

  try {
    const user = await UsersModel.find({ _id: id });
    if (
      user[0].logCategories.some((category) => category.name === newCategory)
    ) {
      return res.status(400).send({ fail: "Cannot add duplicate categories" });
    }

    await UsersModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          logCategories: { name: newCategory },
        },
      }
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/logCategories/:catId", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { newName } = req.body;
  const { catId } = req.params;

  if (!newName) {
    return res.status(400).send("Missing some info");
  }

  try {
    const user = await UsersModel.find({ _id: id });
    const cat = user[0].logCategories.id(catId);

    if (cat === null) {
      return res.status(400).send({ fail: "no such category" });
    }

    cat.remove();

    await user[0].save();

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/follow/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfo.id;

  try {
    let user = await UsersModel.findById(userId);
    if (user.following.some((f) => f === id)) {
      user.following = user.following.filter((f) => f !== id);
    } else {
      user.following.push(id);
    }
    await user.save();
    console.log(user);
    return res.sendStatus(200);
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
      user = await UsersModel.findById( id );
    if(bandId){
        if(!user.bands.some(band=>band.id===bandId)){
            return res.status(400).send({fail:"You're not in this band brother."})
        } else {
            user = await UsersModel.findById(bandId)
        }
    }

    // associated users are: participants of the band, or participants of 
    // a band that a user is in.
    const myBandMates = []
    for (const band of user.bands) {
        const aBand = await UsersModel.findById(band)
        for (const p of aBand.participants) {
            myBandMates.push(p)
        }
    }
    const associatedUsers = [...user.participants, ...myBandMates]
    const myContent = {
        logs: 
        await LogsModel.find({parentUser:{$in: user.logs}})
        ,
        recordings: 
        await RecordingsModel.find({parentUser:{$in: user.recordings}})
        ,
        posts: 
        await PostsModel.find({parentUser:{$in: user.posts}})
        ,
    }



    // // here I need to implement functions that get:
    // // content is: posts, logs, recordings
    // // - all user's content
    // const userContent = {
    //   logs: await LogsModel.find({ _id: { $in: user.logs } }),
    //   posts: await PostsModel.find({ _id: { $in: user.logs } }),
    //   recordings: await RecordingsModel.find({ _id: { $in: user.logs } }),
    // };
    // // - all the people who the user is follwing's content that is not private
    // const followingContent = {
    //   logs: await LogsModel.find({ parentUser: { $in: user.following } }),
    //   posts: await PostsModel.find({ parentUser: { $in: user.following } }),
    //   recordings: await RecordingsModel.find({
    //     parentUser: { $in: user.following },
    //   }),
    // };
    // // everything should be ordered by date desc.
    // let hugeFeed = [].concat(
    //   userContent.logs,
    //   userContent.posts,
    //   userContent.recordings,
    //   followingContent.logs,
    //   followingContent.posts,
    //   followingContent.recordings
    // );
    // hugeFeed.sort((a, b) => a.date - b.date);

    // let organizedFeed = {
    //     logs: [...userContent.logs.sort((a,b)=>a.date-b.date),followingContent.logs.sort((a,b)=>a.date-b.date),],
    //     posts: [...userContent.posts.sort((a,b)=>a.date-b.date),followingContent.posts.sort((a,b)=>a.date-b.date),],
    //     recordings: [...userContent.recordings.sort((a,b)=>a.date-b.date),followingContent.recordings.sort((a,b)=>a.date-b.date),]
    // }

    // // filter option: filters the content based on content type.
    //     // not doing this now.


    return res.status(200).send({associatedUsers, myContent})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get the user's feed
router.post("/feed", verifyUser, async (req, res) => {
  const { id } = req.userInfo;
  const { filter } = req.body;

  try {
    let user = await UsersModel.find({ _id: id });
    user = user[0];

    // here I need to implement functions that get:
    // content is: posts, logs, recordings
    // - all user's content
    const userContent = {
      logs: await LogsModel.find({ _id: { $in: user.logs } }),
      posts: await PostsModel.find({ _id: { $in: user.logs } }),
      recordings: await RecordingsModel.find({ _id: { $in: user.logs } }),
    };
    // - all the people who the user is follwing's content that is not private
    const followingContent = {
      logs: await LogsModel.find({ parentUser: { $in: user.following } }),
      posts: await PostsModel.find({ parentUser: { $in: user.following } }),
      recordings: await RecordingsModel.find({
        parentUser: { $in: user.following },
      }),
    };
    // everything should be ordered by date desc.
    let hugeFeed = [].concat(
      userContent.logs,
      userContent.posts,
      userContent.recordings,
      followingContent.logs,
      followingContent.posts,
      followingContent.recordings
    );
    hugeFeed.sort((a, b) => a.date - b.date);

    let organizedFeed = {
        logs: [...userContent.logs.sort((a,b)=>a.date-b.date),followingContent.logs.sort((a,b)=>a.date-b.date),],
        posts: [...userContent.posts.sort((a,b)=>a.date-b.date),followingContent.posts.sort((a,b)=>a.date-b.date),],
        recordings: [...userContent.recordings.sort((a,b)=>a.date-b.date),followingContent.recordings.sort((a,b)=>a.date-b.date),]
    }

    // filter option: filters the content based on content type.
        // not doing this now.


    return res.status(200).send({userFeed:hugeFeed, organizedFeed})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
