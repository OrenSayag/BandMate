const UsersModel = require("../DB/models/users");
const router = require("express").Router();
const mongoose = require("mongoose");
const { privateGuard } = require("../toolFunctions");
const RecordingsModel = require("../DB/models/recordings");
const multer = require("multer")

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

/**
 * Connect Mongo Driver to MongoDB.
 * ------------ for the streaming endpoints
 */
 let db;
 MongoClient.connect('mongodb://localhost/bandmate', (err, client) => {
   if (err) {
     console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
     process.exit(1);
   }
   db = client.db('bandmate')
   console.log("alright STREAMIT")
 });



// stream video
router.get("/streamVideo/:fileId", async (req, res) => {
  const { fileId } = req.params

  res.set('content-type', 'video/mp4');
  res.set('accept-ranges', 'bytes');

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'fs'
  });

  try {
    var trackID = new ObjectID(fileId);
  } catch(err) {
    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
  }

  let downloadStream = bucket.openDownloadStream(trackID);

  downloadStream.on('data', (chunk) => {
     res.write(chunk);
  });

  downloadStream.on('error', (err) => {
    console.log(err)
     res.sendStatus(404);
  });

  downloadStream.on('end', () => {
     res.end();
  });
});

// stream audio
router.get("/streamAudio/:fileId", async (req, res) => {
  const { fileId } = req.params

  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'fs'
  });

  try {
    var trackID = new ObjectID(fileId);
  } catch(err) {
    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
  }

  let downloadStream = bucket.openDownloadStream(trackID);

  downloadStream.on('data', (chunk) => {
     res.write(chunk);
  });

  downloadStream.on('error', (err) => {
    console.log(err)
     res.sendStatus(404);
  });

  downloadStream.on('end', () => {
     res.end();
  });
});

const upload = require("../middleware/upload");
// const AudioModel = require("../DB/models/audio");

// upload file
router.post("/uploadFile", async (req, res) => {
  try{
  await upload(req, res);

  // console.log(req.file);
  if (req.file == undefined) {
    return res.send({fail:`You must select a file.`});
  }

  return res.send({ok:`File ${req.file.id} has been uploaded.`,
                   fileId: req.file.id
});
} catch (error) {
  console.log(error);
  return res.send({fail:`Error when trying upload image: ${error}`});
}
});




















































// post new recording
router.post("/", async (req, res) => {
  const { id } = req.userInfo;
  const {
    bandId,
    isPrivate,
    fileSrc,
    mediaType,
    categories,
    ratingStars,
    users,
    title,
    instruments,
    date,
  } = req.body;
  if (!fileSrc || isPrivate===undefined || !mediaType || !instruments ) {
    // console.log(fileSrc)
    // console.log(isPrivate)
    // console.log(mediaType)
    // console.log(instruments)
    return res.status(400).send({ fail: "Missing fileSrc || isPrivate || mediaType || instruments" });
  }
  if(mediaType!=="video" && mediaType!=="audio"){
    return res.status(400).send({"fail":"recieved wrong media type"})
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

    console.log("INSTRUMENTS: ",instruments)

    const recording = await new RecordingsModel({
      bandId,
      isPrivate,
      fileSrc,
      mediaType,
      ratingStars,
      users,
      title,
      date,
      parentUser,
      isPrivate,
      categories,
      instruments,
      type: "recording",
    });

    await recording.save();

    return res.status(201).send({"ok":"successfully added recording to LA BANK"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// rate a recording
router.put("/rate/:id", async (req, res) => {
  const userId = req.userInfo.id;
  const {id} = req.params;
  const {stars} = req.body;
  if(stars===undefined){
    return res.status(400).send({fail:"missing stars"})
  }
  if(stars < 0 || stars > 5){
    
    return res.status(400).send({ fail: "Invalid rating rate between 0 and 5" });
  }
  try {
    const recording = await RecordingsModel.findById(id)

    if(!recording){
      return res.status(400).send({"fail":"no such recording"})
    }

    const parentUser = await UsersModel.findById(recording.parentUser)
    if((recording.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

      return res.status(400).send({ fail: "Only parentuser or participants can rate content" });
    }

    recording.ratingStars = Math.floor(stars)
    await recording.save()


    return res.status(201).send({"ok":"successfully rated recording"});
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

    // console.log(user.likedRecordings)

    if(!user.likedRecordings.some(r=>r.toString()==id)){
      // console.log("it is not liked")
      await UsersModel.findByIdAndUpdate(userId, {
        $push:{
          likedRecordings:mongoose.Types.ObjectId(recording._id)
        }
      }
      )
      await RecordingsModel.findByIdAndUpdate(id, {
        $push:{
          likes:mongoose.Types.ObjectId(userId)
        }
      }
      )
    } else {
      // console.log("it is liked")
      await UsersModel.findByIdAndUpdate(userId, {
        $pull:{
          likedRecordings:mongoose.Types.ObjectId(recording._id)
          }
        }
      )
      await RecordingsModel.findByIdAndUpdate(id, {
        $pull:{
          likes:mongoose.Types.ObjectId(userId)
          }
        }
      )
    }

    return res.status(200).send({"ok":"successfully un/liked recording"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// post new comment
router.post("/comment/:id" ,async (req, res) => {
  // const { username } = req.userInfo;
  const userId = req.userInfo.id;
  const { id } = req.params;
  const { text } = req.body;

    if(!text) {
        return res.status(400).send({fail:"Missing text"})
    }
  try {
    const recording = await RecordingsModel.findById(id)
    if(recording===null){
      return res.status(400).send({fail:"no such recording"})
    }

    if(await privateGuard(recording, userId)===false){
    return res.status(400).send({fail:"Hey you shouldn't even see this recording!"})
    }

    let comment = await RecordingsModel.findByIdAndUpdate(id, {
      $push:{
        comments: {
          text,
          userId
        }
      }
    })
    // .populate({path:"comments.userId", select:"username profile_img_src"})

    comment = comment.comments[comment.comments.length-1]

    // console.log(comment)

    return res.status(201).send({ok:"successfully posted comment for this recording", id: comment._id})
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
    // console.log("comment id: "+commentId)
    const comment = recording.comments.id(mongoose.Types.ObjectId(commentId))
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

    return res.status(200).send({ok:"successfully deleted comment from recording"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// deletes a recording
router.delete("/:recordingId" ,async (req, res) => {
  const { recordingId } = req.params;
  const userId = req.userInfo.id;
  try {
    // check that user is the parentuser of this post
    const recording = await RecordingsModel.findById(recordingId)
    if(!recording){
      return res.status(400).send({fail:"No such recording"})
    }


    const parentUser = await UsersModel.findById(recording.parentUser)
    if((recording.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

      return res.status(400).send({ fail: "This recording is not yours to delete" });
    }

    await RecordingsModel.findByIdAndDelete(recordingId)

    return res.status(200).send({"ok":"deleted this recording"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get a single recording
router.get("/:recordingId" ,async (req, res) => {
  const { recordingId } = req.params;
  const userId = req.userInfo.id;
  try {
   // check that it can be seen
    const recording = await RecordingsModel.findById(recordingId)
      .populate({
        path:"parentUser",
        populate:"participants",
        select:"-hashedPass -mail"
      })
    if(!recording){
      return res.status(400).send({"fail":"no such recording"})
    }

   if(await privateGuard(recording, userId) === false){
    return res.status(400).send({fail:"this recording is private for participants and parent user, and you cannot see it"})
   }

    return res.status(200).send({"ok":"this is the recording", recording})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
