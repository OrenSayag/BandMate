const PostsModel = require("../DB/models/posts");
const UsersModel = require("../DB/models/users");
const router = require("express").Router();
const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema
const { privateGuard } = require("../toolFunctions")

// test
router.get("/", async (req, res) => {
  return res.send("/posts works!")
});

// post new post
router.post("/" ,async (req, res) => {
  const { id } = req.userInfo;
  const { content, isPrivate, fileSrc, bandId, mediaType } = req.body;
    if(!content || isPrivate === undefined) {
        return res.status(400).send({fail:"Missing content || isPrivate"})
    }
    if(mediaType!=="no media" && mediaType!=="video" && mediaType!=="picture"){
      return res.status(400).send({"fail":"recieved wrong media type"})
    }
    if((mediaType==="video" || mediaType==="picture") && fileSrc===undefined){
      return res.status(400).send({"fail":"recieved a positive media type but no fileSrc"})
    }
  try {

    let user = await UsersModel.findById(id);

    if(bandId && (id!=bandId)){
      if(!user.bands.some(b=>b==bandId)){
  
        return res.status(400).send({"fail":"You're not in this band brother."})
      }
    }

    let parentUser;

    if(bandId&&id!=bandId){
        parentUser = bandId
      } else {
      parentUser = id
    }

    const post = await new PostsModel({
        content,
        parentUser,
        date: new Date(),
        isPrivate,
        type: "post",
        mediaType,
        fileSrc
    })

    await post.save()

    return res.status(201).send({ok:"successfully added a post"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// edit a post
router.put("/:id" ,async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfo.id;
  const { content, isPrivate } = req.body;
    if(!content && !isPrivate) {
        return res.status(400).send({fail:"Missing content or isPrivate"})
    }
  try {
    const post = await PostsModel.findById(id)
    if(!post){
      return res.status(400).send({fail:"No such post"})
    }
    if(post.parentUser!==userId){
      return res.status(400).send({fail:"This isn't your post"})
    }
    if(content){
      await PostsModel.findByIdAndUpdate(id, {
        $set:{
          content
        }
      })
    }
    if(isPrivate){
      await PostsModel.findByIdAndUpdate(id, {
        $set:{
          isPrivate
        }
      })
    }

    return res.sendStatus(200)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete a post
router.delete("/:id" ,async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfo.id;
  try {

    const post = await PostsModel.findById(id)
    if(!post){
      return res.status(400).send({fail:"No such post"})
    }

    const parentUser = await UsersModel.findById(post.parentUser)
    if((post.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

      return res.status(400).send({ fail: "This post is not yours to delete" });
    }


    // if(post.parentUser!==userId){
    //   return res.status(400).send({fail:"This isn't your post to delete."})
    // }

    post.remove()

    return res.status(200).send({ok:"successfully deleted this post"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// toggles like on a post
router.put("/like/:id" ,async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfo.id;
  try {
    const post = await PostsModel.findById(id)
    if(!post){
      return res.status(400).send({fail:"No such post"})
    }
    // let participants = await UsersModel.findById(post.parentUser)
    // participants = participants.participants

    // if(
    //   post.isPrivate && ((userId!==post.parentUser.toString()) &&
    //  !(participants.some(p=>p.id===userId)))
    // ){
    //   return res.status(400).send({fail:"This isn't your post to like."})
    // }
    
    if(await privateGuard(post, userId)===false){
        return res.status(400).send({fail:"This post is private, you're not poster or band member"})
    }


    const user = await UsersModel.findById(userId)

    if(!user.likedPosts.some(p=>p.toString()==post._id)){
      await UsersModel.findByIdAndUpdate(userId, {
        $push:{
          likedPosts:post._id
          }
        }
      )
      await PostsModel.findByIdAndUpdate(id, {
        $push:{
          likes:userId
          }
        }
      )
    } else {
      await UsersModel.findByIdAndUpdate(userId, {
        $pull:{
          likedPosts:post._id
          }
        }
      )
      await PostsModel.findByIdAndUpdate(id, {
        $pull:{
          likes:userId
          }
        }
      )
    }

    return res.status(200).send({ok:"liked/unliked post"})
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
    const post = await PostsModel.findById(id)
    if(post===null){
      return res.status(400).send({fail:"no such post"})
    }

    if(await privateGuard(post, userId)===false){
    return res.status(400).send({fail:"Hey you shouldn't even see this post!"})
    }

    await PostsModel.findByIdAndUpdate(id, {
      $push:{
        comments: {
          text,
          username,
          userId
        }
      }
    })

    let comment = await PostsModel.findById(id)

    comment = comment.comments[comment.comments.length-1]

    return res.status(201).send({ok:"successfully posted a comment on this post",id:comment._id})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// deletes a comment
router.delete("/comment/:postId/:commentId" ,async (req, res) => {
  const { commentId, postId } = req.params;
  const userId = req.userInfo.id;
  try {
    // check that user is the parentuser of this post
    const post = await PostsModel.findById(postId)
    const comment = post.comments.id(commentId)
    // console.log(comment)
    if(comment.userId!=userId){
      return res.status(400).send({fail:"Hey, this is not your comment!"})
    }

    await PostsModel.findByIdAndUpdate(postId, {
      $pull: {
        comments: {
          _id: commentId,
          // text:"test comment on post",
        }
      }
    })

    return res.status(200).send({ok:"successfully deleted this comment"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// deletes a post
router.delete("/:postId" ,async (req, res) => {
  const { postId } = req.params;
  const userId = req.userInfo.id;
  try {
    // check that user is the parentuser of this post
    const post = await PostsModel.findById(postId)
    if(!post){
      return res.status(400).send({fail:"No such post"})
    }

    const parentUser = await UsersModel.findById(poat.parentUser)
    if((post.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

      return res.status(400).send({ fail: "This post is not yours to delete" });
    }

    await PostsModel.findByIdAndDelete(postId)

    return res.status(200).send({"ok":"deleted this post"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;