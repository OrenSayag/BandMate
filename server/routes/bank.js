const PostsModel = require("../DB/models/posts");
const UsersModel = require("../DB/models/users");
const router = require("express").Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { privateGuard } = require("../toolFunctions");
const RecordingsModel = require("../DB/models/recordings");

// test
router.get("/", async (req, res) => {
  return res.send("/bank works!");
});

// post new recording
router.post("/", async (req, res) => {
  const { id } = req.userInfo;
  const {
    bandId,
    isPrivate,
    fileSrc,
    mediaType,
    ratingStars,
    users,
    title,
    date,
  } = req.body;
  if (!fileSrc || !isPrivate || !mediaType ) {
    return res.status(400).send({ fail: "Missing fileSrc || isPrivate || mediaType" });
  }
  try {
    const recording = await new RecordingsModel({
      bandId,
      isPrivate,
      fileSrc,
      mediaType,
      ratingStars,
      users,
      title,
      date,
      parentUser: mongoose.Types.ObjectId(id),
      isPrivate,
      type: "recording",
    });

    await recording.save();

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// rate a recording
router.put("/rate/:id", async (req, res) => {
  const userId = req.userInfo.id;
  const {id} = req.params;
  const {bandId, stars} = req.body;
  if(!stars){
    return res.status(400).send({fail:"missing stars"})
  }
  try {
    const recording = await RecordingsModel.findById(id)
    
    if(await privateGuard(recording, userId)===false){
      return res.status(400).send({fail:"Hey you shouldn't even see this recording!"})
      }

    recording.ratingStars = Math.floor(stars)
    await recording.save()


    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// toggles like on a recording
router.put("/like/:id" ,async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfo.id;
  try {
    const recording = await RecordingsModel.findById(id)
    if(!recording){
      return res.status(400).send({fail:"No such recording"})
    }
    
    if(await privateGuard(recording, userId)===false){
      return res.status(400).send({fail:"Hey you shouldn't even see this recording!"})
      }


    const user = await UsersModel.findById(userId)

    console.log(user.likedRecordings)

    if(!user.likedRecordings.some(p=>p.toString()==id)){
      console.log("it is not liked")
      await UsersModel.findByIdAndUpdate(userId, {
        $push:{
          likedRecordings:mongoose.Types.ObjectId(recording._id)
        }
      }
      )
    } else {
      console.log("it is liked")
      await UsersModel.findByIdAndUpdate(userId, {
        $pull:{
          likedRecordings:mongoose.Types.ObjectId(recording._id)
          }
        }
      )
    }

    return res.sendStatus(200)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// post new comment
router.post("/comment/:id" ,async (req, res) => {
  const { username } = req.userInfo;
  const userId = req.userInfo.id;
  const { id } = req.params;
  const { text } = req.body;

    if(!text) {
        return res.status(400).send({fail:"Missing text"})
    }
  try {
    const recording = await RecordingsModel.findById(id)
    if(recording===null){
      return res.status(400).send({fail:"no such ercording"})
    }

    if(await privateGuard(recording, userId)===false){
    return res.status(400).send({fail:"Hey you shouldn't even see this recording!"})
    }

    await RecordingsModel.findByIdAndUpdate(id, {
      $push:{
        comments: {
          text,
          userId
        }
      }
    })

    return res.sendStatus(201)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// deletes a comment
router.delete("/comment/:recordingId/:commentId" ,async (req, res) => {
  const { commentId, recordingId } = req.params;
  const userId = req.userInfo.id;
  try {
    // check that user is the parentuser of this post
    const recording = await RecordingsModel.findById(recordingId)
    if(!recording){
      return res.status(400).send({fail:"No such recording"})
    }
    const comment = recording.comments.id(commentId)
    if(!comment){
      return res.status(400).send({fail:"No such comment"})
    }
    if(comment.userId!=userId){
      return res.status(400).send({fail:"Hey, this is not your comment!"})
    }

    

    await RecordingsModel.findByIdAndUpdate(recordingId, {
      $pull: {
        comments: {
          _id: commentId,
          // text:"test comment on post",
        }
      }
    })

    return res.sendStatus(200)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// // edit a post
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const userId = req.userInfo.id;
//   const { content, isPrivate } = req.body;
//   if (!content && !isPrivate) {
//     return res.status(400).send({ fail: "Missing content or isPrivate" });
//   }
//   try {
//     const post = await PostsModel.findById(id);
//     if (!post) {
//       return res.status(400).send({ fail: "No such post" });
//     }
//     if (post.parentUser !== userId) {
//       return res.status(400).send({ fail: "This isn't your post" });
//     }
//     if (content) {
//       await PostsModel.findByIdAndUpdate(id, {
//         $set: {
//           content,
//         },
//       });
//     }
//     if (isPrivate) {
//       await PostsModel.findByIdAndUpdate(id, {
//         $set: {
//           isPrivate,
//         },
//       });
//     }

//     return res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // edit a post
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   const userId = req.userInfo.id;
//   try {
//     const post = await PostsModel.findById(id);
//     if (!post) {
//       return res.status(400).send({ fail: "No such post" });
//     }
//     if (post.parentUser !== userId) {
//       return res.status(400).send({ fail: "This isn't your post to delete." });
//     }

//     post.remove();

//     return res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // toggles like on a post
// router.put("/like/:id", async (req, res) => {
//   const { id } = req.params;
//   const userId = req.userInfo.id;
//   try {
//     const post = await PostsModel.findById(id);
//     if (!post) {
//       return res.status(400).send({ fail: "No such post" });
//     }
//     let participants = await UsersModel.findById(post.parentUser);
//     participants = participants.participants;

//     if (
//       post.isPrivate &&
//       userId !== post.parentUser.toString() &&
//       !participants.some((p) => p.id === userId)
//     ) {
//       return res.status(400).send({ fail: "This isn't your post to like." });
//     }

//     const user = await UsersModel.findById(userId);

//     if (!user.likedPosts.some((p) => p.toString() == post._id)) {
//       await UsersModel.findByIdAndUpdate(userId, {
//         $push: {
//           likedPosts: post._id,
//         },
//       });
//     } else {
//       await UsersModel.findByIdAndUpdate(userId, {
//         $pull: {
//           likedPosts: post._id,
//         },
//       });
//     }

//     return res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // post new comment
// router.post("/comment/:id", async (req, res) => {
//   const { username } = req.userInfo;
//   const userId = req.userInfo.id;
//   const { id } = req.params;
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).send({ fail: "Missing text" });
//   }
//   try {
//     const post = await PostsModel.findById(id);
//     if (post === null) {
//       return res.status(400).send({ fail: "no such post" });
//     }

//     if ((await privateGuard(post, userId)) === false) {
//       return res
//         .status(400)
//         .send({ fail: "Hey you shouldn't even see this post!" });
//     }

//     await PostsModel.findByIdAndUpdate(id, {
//       $push: {
//         comments: {
//           text,
//           username,
//           userId,
//         },
//       },
//     });

//     return res.sendStatus(201);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

// // deletes a comment
// router.delete("/comment/:postId/:commentId", async (req, res) => {
//   const { commentId, postId } = req.params;
//   const userId = req.userInfo.id;
//   try {
//     // check that user is the parentuser of this post
//     const post = await PostsModel.findById(postId);
//     const comment = post.comments.id(commentId);
//     console.log(comment);
//     if (comment.userId != userId) {
//       return res.status(400).send({ fail: "Hey, this is not your comment!" });
//     }

//     await PostsModel.findByIdAndUpdate(postId, {
//       $pull: {
//         comments: {
//           _id: commentId,
//           // text:"test comment on post",
//         },
//       },
//     });

//     return res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

module.exports = router;
