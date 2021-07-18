const PostsModel = require("../DB/models/posts");
const UsersModel = require("../DB/models/users");
const router = require("express").Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { privateGuard } = require("../toolFunctions");
const RecordingsModel = require("../DB/models/recordings");

// test
router.get("/", async (req, res) => {
  return res.send("/band works!");
});

// makeAdmin - makes an admin of a band from a participant
router.put("/makeAdmin", async (req, res) => {
  const { id } = req.userInfo;
  const {
    bandId,
    futureAdminId
  } = req.body;
  if (!bandId || !futureAdminId ) {
    return res.status(400).send({ fail: "Missing bandId || futureAdminId" });
  }
  try {
    
    // get band, check if id is admin, check if future is participant,
    // if so - changed futureids in participants role to admin

    const band = await UsersModel.findById(bandId)
    if(!band){
      return res.status(400).send({fail:"No such band"})
    }
    const admin = band.participants.find(p=>{return p.userId==id})
    if(!admin){
      return res.status(400).send({fail:"You're not in this band"})
    }
    
    if(admin.role!=="admin"){
      return res.status(400).send({fail:"You're not an admin in this band"})
    }
    
    const futureAdmin = band.participants.find(p=>p.userId==futureAdminId)
    if(!futureAdmin){
      return res.status(400).send({fail:"No such participant in this band"})
    }

    futureAdmin.role = "admin"

    await band.save()

    // await UsersModel.findByIdAndUpdate(bandId, {
    //   $set:{
    //     comments:{

    //     }
    //   }
    // })
    
    

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// remove member from band
router.delete("/participant", async (req, res) => {
  const userId  = req.userInfo.id;
  const { bandId, toBeRemovedId } = req.body
  
  if (!bandId || !toBeRemovedId ) {
    return res.status(400).send({ fail: "Missing bandId || toBeRemovedId" });
  }
  try {
    
    // all participants can remove themselves
    // get band, validate user is admin of this band, 
    // delete other member if isn't admin.

    const band = await UsersModel.findById(bandId)
    if(!band){
      return res.status(400).send({fail:"No such band"})
    }
    
    const admin = band.participants.find(p=>p.userId==userId)
    if(!admin){
      return res.status(400).send({fail:"You're not in this band"})
    }

    if(admin===toBeRemovedId){
      band.participants = band.participants.filter(p=>p!==mongoose.Types.ObjectId(userId))
      await UsersModel.findByIdAndUpdate(toBeRemoved, {
        $pull:{
          bands: bandId
        }
      })
      await band.save()
    }
    
    if(admin.role!=="admin"){
      return res.status(400).send({fail:"You're not an admin in this band"})
    }
    
    const toBeRemoved = band.participants.find(p=>p.userId==toBeRemovedId)
    if(!toBeRemoved){
      return res.status(400).send({fail:"No such participant in this band"})
    }
    
    band.participants = band.participants.filter(p=>p.userId!=toBeRemovedId)
    UsersModel.findByIdAndUpdate(toBeRemoved, {
      $pull:{
        bands: bandId
      }
    })
    await band.save()
    
    // await UsersModel.findByIdAndUpdate(bandId, {
    //   $set:{
    //     comments:{

    //     }
    //   }
    // })

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


module.exports = router;
