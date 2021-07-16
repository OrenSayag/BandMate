const PostsModel = require("../DB/models/posts");
const UsersModel = require("../DB/models/users");
const router = require("express").Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { privateGuard } = require("../toolFunctions");
const RecordingsModel = require("../DB/models/recordings");
const MessagesModel = require("../DB/models/messages");
const GroupConversationsModel = require("../DB/models/groupConversations");

// test
// router.get("/", async (req, res) => {
//   return res.send("/messages works!");
// });

// send a message (can also be a join band req)
router.post("/", async (req, res) => {
  const { id } = req.userInfo;
  const { to, content, isJoinReq } = req.body;

  // console.log(req.userInfo.username);

  if (!to || !content) {
    return res.status(400).send({ fail: "Missing to || content" });
  }
  if (id === to) {
    return res.status(400).send({ fail: "Don't send a message to yourself." });
  }
  try {
    //  check if we're talking join req, if not, continue normally on sending the messaeg
    if (isJoinReq === true) {
      console.log("is join req");
      const fromWho = await UsersModel.findById(id);
      const toWho = await UsersModel.findById(to);
      if(!toWho){
        return res.status(400).send({"fail":"No such user brother"})
      }
      if (fromWho.isBand && toWho.isBand) {
        return res.status(400).send({ fail: "A band can't join a band" });
      }
      if (!(fromWho.isBand || toWho.isBand)) {
        return res.status(400).send({ fail: "One of you must be a band" });
      }

      // if the non band side is already in the band, return 400
      if (req.userInfo.isBand) {
        const band = await UsersModel.findById(id);
        console.log(band);
        console.log(to);

        if (band.participants.some((p) => p.userId == to)) {
          return res
            .status(400)
            .send({ fail: "This user is already in your band" });
        }
      } else {
        const band = await UsersModel.findById(to);
        console.log(band);
        console.log(to);
        if (band.participants.some((p) => p.userId == id)) {
          return res.status(400).send({ fail: "You are already in this band" });
        }
      }

      const reqExists = await MessagesModel.find({
        $and: [
          {
            $or: [
              {
                to: mongoose.Types.ObjectId(id),
                from: mongoose.Types.ObjectId(to),
              },
              {
                to: mongoose.Types.ObjectId(to),
                from: mongoose.Types.ObjectId(id),
              },
            ],
          },
          {
            // status: "pending"
            status: "pending",
          },
        ],
      });
      if (reqExists.length > 0) {
        return res
          .status(400)
          .send({ fail: "join request between you already exists" });
      }

      const newMessage = await new MessagesModel({
        content,
        from: id,
        to,
        isJoinReq,
        type: "message",
        status: "pending",
      });

      console.log(newMessage);

      let _id = await newMessage.save();
      _id = _id._id
      // in order to display different things on client's req btn on profile
      fromWho.joinReqsWithUsers.push(await mongoose.Types.ObjectId(to))
      await UsersModel.findByIdAndUpdate(to, {
        $push: {
          joinReqsWithUsers: id
        }
      })
      

      await fromWho.save()

      return res.status(201).send({ok:"successfully sent a join request", _id});
    }

    if (
      (await UsersModel.findById(to)) === null &&
      (await GroupConversationsModel.findById(to)) === null
    ) {
      return res.status(400).send({ fail: "No such user or group" });
    }

    let newMessage;
    let group = await GroupConversationsModel.findById(to);
    if (!group) {
      newMessage = await new MessagesModel({
        content,
        from: id,
        to,
        type: "message",
      });
    } else {
      if (
        !group.userIds.some((member) => member == id) &&
        !group.admins.some((member) => member == id)
      ) {
        return res
          .status(400)
          .send({ fail: "You're not a member of this group" });
      }

      newMessage = await new MessagesModel({
        content,
        from: id,
        to,
        type: "group message",
      });
    }

    let _id = await newMessage.save();
    _id = _id._id
    console.log(_id)
    return res.status(201).send({ok:"successfully sent message"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get user's conversations
router.get("/preview", async (req, res) => {
  const { id } = req.userInfo;
  try {

    

    // let preview = await MessagesModel.find({
    //   $or: [
    //     {from: id},
    //     {to: id},
    //   ],
    // })
    // // .limit(1)
    // .sort("-date")

    

    const userGroups = await GroupConversationsModel.find({ userIds: id });
    const userGroupsIds = [];
    for (const group of userGroups) {
      userGroupsIds.push(group._id);
    }
    // console.log(userGroupsIds)
    const conversation = await MessagesModel.find({
      // $or: [{ from: id }, { to: id }, { to: { $in: userGroupsIds } }],
      $and: [
        {$or: [{ from: id }, { to: id },]},
        {type: "message"}
      ]
      // $or: [{ from: id }, { to: id }}}],
    }).sort("date").populate({
      path:"to",
      select: "username profile_img_src"
    }).populate({
      path:"from",
      select: "username profile_img_src"
    });

    // // console.log(conversation)

    // // organize coversations by contact name, and by groups
    let conversations = {};
    for (const message of conversation) {
      // if (message.type == "group message") {
      //   // console.log("hey this is a group message")
      //   console.log(message);
      //   const group = await GroupConversationsModel.findById(message.to);

      //   if (!conversations[group.name]) {
      //     conversations[group.name] = [];
      //   }
      //   conversations[group.name].push(message);
      // } else {
        if (message.from._id != id) {
          // console.log(message.from)
          const user = await UsersModel.findById(message.from._id);
          if (!Array.isArray(conversations[user.username])) {
            conversations[user.username] = [];
          }
          conversations[user.username].push(message);
        } else {
          const user = await UsersModel.findById(message.to._id);
          if (!Array.isArray(conversations[user.username])) {
            conversations[user.username] = [];
          }
          conversations[user.username].push(message);
        }
      }

    //   // settle group conversations
      const groupConversation = await MessagesModel.find({
        to: {$in: userGroupsIds}
      }).populate({
        path:"from",
        select: "username"
      });
      for (const message of groupConversation) {
        const group = await GroupConversationsModel.findById(message.to);

        if (!conversations[group.name]) {
          conversations[group.name] = [];
        }
        conversations[group.name].push(message);
      }

    // }

    const preview = []
    for (let contact in conversations) {
      // if (Object.hasOwnProperty.call(object, contact)) {
      //   const element = object[contact];
        
      // }
      conversations[contact] = conversations[contact][conversations[contact].length-1]
      preview.push(conversations[contact])
    }


    

    return res.status(200).send({ preview, ok:"successfully fetched conversations preview" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get a specific conversation
router.post("/conversation/:withId", async (req, res) => {
  const { id } = req.userInfo;
  const { withId } = req.params;
  // const { isGroup } = req.body;
  try {

    if(await GroupConversationsModel.findById(withId)){
      const group = await GroupConversationsModel.findById(withId)
      if(!group){
        return res.status(400).send({fail:"No such group"})
      }
      console.log(group)
      if(!group.userIds.some(async(m)=>m!=await mongoose.Types.ObjectId(id))){
        return res.status(400).send({fail:"You are not in this group"})
      }

      
      // get all messages of this group
      const conversation = await MessagesModel.find({to:withId})
      .populate({
        path:"from",
        select: "username _id"
      })

      conversation.username = group.name
      conversation.group_profile_img_src = group.group_profile_img_src
      conversation.groupConversation = true;
      
      return res.status(200).send({ok:"Here are this group's messages", conversation})
    }

    const withUser = await UsersModel.findById(withId)
    if(!withUser){
      return res.status(400).send({fail:"No such user"})
    }

    const conversation = {}

    conversation.username = withUser.username
    conversation._id = withUser._id
    conversation.profile_img_src = withUser.profile_img_src
    conversation.groupConversation = false;

    conversation.messages = await MessagesModel.find({
      $or: [
        {$and: [
          {from: id},
          {to: withId}
        ]},
        {$and: [
          {to: id},
          {from: withId}
        ]},
      ]
    })
    .populate({
      path:"to",
      select: "username _id"
    })
    .populate({
      path:"from",
      select: "username _id"
    })

    return res.status(200).send({ conversation, ok:"Successfuly fetched conversation with this profile" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get a group's info
router.get("/group/info/:groupId", async (req, res) => {
  const { id } = req.userInfo;
  const { groupId } = req.params;
  try {

    const group = await GroupConversationsModel.findById(groupId)
    .populate({
      path: "userIds",
      select: "profile_img_src username _id"
    })
    .populate({
      path: "admins",
      select: "profile_img_src username _id"
    })

    if(!group){
      return res.status(400).send({fail:"No such group"})
    }

    const groupInfo = {}
    groupInfo.groupName = group.name
    groupInfo.members = group.userIds
    groupInfo.group_profile_img_src = group.group_profile_img_src

    return res.status(200).send({ groupInfo, ok:"Successfuly fetched this group's info" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// reply to a join request
router.put("/replyJoinRequest/:messageId", async (req, res) => {
  const { id } = req.userInfo;
  const { messageId } = req.params;
  // const { bandId, toBeAddedUserId, answer } = req.body;
  const { answer } = req.body;

  try {
    // validate message exists,
    // status is not resolved, isJoinReq, user is the "to"
    // (if user is the from - status to cancel), set status to resolved
    // and add/don't add based on answer

    const message = await MessagesModel.findById(messageId);
    if (!message) {
      return res.status(400).send({ fail: "No such message" });
    }

    if (
      message.status === "canceled" ||
      message.status === "approved" ||
      message.status === "rejected"
    ) {
      return res.status(400).send({ fail: "This request is closed" });
    }

    if (message.from == id) {
      message.status = "canceled";
      await message.save();
      // await UsersModel.findByIdAndUpdate(id, {
      //   $pull: {
      //     joinReqsWithUsers: message.to,
      //     joinReqsWithUsers: message.from,
      //   }
      // })
      await UsersModel.findByIdAndUpdate(message.to, {
        $pull: {
          joinReqsWithUsers: mongoose.Types.ObjectId(id)
        }
      })
      await UsersModel.findByIdAndUpdate(message.from, {
        $pull: {
          joinReqsWithUsers: mongoose.Types.ObjectId(message.to)
        }
      })
      return res.status(200).send({ok:"successfully canceled join req"});
    }

    if (message.to != id) {
      return res.status(400).send({ fail: "This request was not sent to you" });
    }

    switch (answer) {
      case "approve":
        if (req.userInfo.isBand) {
          const band = await UsersModel.findById(id);
          if (band.participants.length === 0) {
            await UsersModel.findByIdAndUpdate(id, {
              $push: {
                participants: {
                  userId: message.from,
                  role: "admin",
                },
              },
            });
            const user = await UsersModel.findByIdAndUpdate(
              mongoose.Types.ObjectId(message.from),
              {
                $push: {
                  bands: message.to,
                },
              }
            );
            console.log(user);
          } else {
            await UsersModel.findByIdAndUpdate(id, {
              $push: {
                participants: {
                  userId: message.from,
                },
              },
            });
            await UsersModel.findByIdAndUpdate(id, {
              $push: {
                bands: mongoose.Types.ObjectId(message.from),
              },
            });
          }
        } else {
          await UsersModel.findByIdAndUpdate(message.from, {
            $push: {
              participants: {
                userId: message.to,
              },
            },
          });
          await UsersModel.findByIdAndUpdate(id, {
            $push: {
              bands: mongoose.Types.ObjectId(message.from),
            },
          });
        }
        message.status = "approved";
        await message.save();
        break;

      case "reject":
        message.status = "rejected";
        await message.save();
        break;

      default:
        return res
          .status(400)
          .send({ fail: "Invalid answer: approve or reject" });
    }

    await UsersModel.findByIdAndUpdate(id, {
      $pull: {
        joinReqsWithUsers: mongoose.Types.ObjectId(message.to),
        joinReqsWithUsers: mongoose.Types.ObjectId(message.from),
      }
    })
    await UsersModel.findByIdAndUpdate(message.to, {
      $pull: {
        joinReqsWithUsers: mongoose.Types.ObjectId(id)
      }
    })
    await UsersModel.findByIdAndUpdate(message.from, {
      $pull: {
        joinReqsWithUsers: mongoose.Types.ObjectId(id)
      }
    })

    return res.status(200).send({ok:"successfully approved/rejected this join request"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete a message
router.delete("/:id", async (req, res) => {
  const userId = req.userInfo.id;
  const { id } = req.params;

  try {
    const message = await MessagesModel.findById(id);

    if (message.from != userId) {
      return res.status(400).send({ fail: "This isn't your message!" });
    }

    await MessagesModel.findByIdAndRemove({ _id: id });

    return res.status(200).send({ok:"successfully deleted this message"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// craetes a group
router.post("/group", async (req, res) => {
  const { id } = req.userInfo;
  let { userIds, name } = req.body;
  if (!name) {
    return res.status(400).send({ fail: "Missing name" });
  }
  if (!userIds) {
    userIds = [];
  }
  try {
    const group = new GroupConversationsModel({
      userIds: [id, ...userIds],
      name,
      admins: [id],
    });

    let groupId = await group.save();
    groupId = groupId._id
    return res.status(201).send({ok:"successfully created this group", groupId});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// deletes a group
router.delete("/group/:groupId", async (req, res) => {
  const { id } = req.userInfo;
  let { groupId } = req.params;
  if (!groupId) {
    return res.status(400).send({ fail: "Missing groupId" });
  }
  try {
    const group = await GroupConversationsModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ fail: "No such group" });
    }
    if (!group.admins.some((admin) => admin == id)) {
      return res
        .status(400)
        .send({ fail: "You are not an admin is this group" });
    }
    await GroupConversationsModel.findByIdAndDelete(groupId);
    return res.status(200).send({ok:"successfuly deleted this group"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// admin promotes a member to be an admin
router.put("/group/admin/:toBeAdminned", async (req, res) => {
  const { id } = req.userInfo;
  let { groupId } = req.body;
  let { toBeAdminned } = req.params;
  if (!groupId) {
    return res.status(400).send({ fail: "Missing groupId" });
  }
  try {
    const group = await GroupConversationsModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ fail: "No such group" });
    }
    if (!group.admins.some((admin) => admin == id)) {
      return res
        .status(400)
        .send({ fail: "You are not an admin in this group" });
    }
    if (!group.userIds.some((member) => member == toBeAdminned)) {
      return res.status(400).send({ fail: "This user is not is this group" });
    }
    if (group.admins.some((admin) => admin == toBeAdminned)) {
      return res
        .status(400)
        .send({ fail: "This user is already an admin in this group" });
    }

    await GroupConversationsModel.findByIdAndUpdate(groupId, {
      $push: {
        admins: mongoose.Types.ObjectId(toBeAdminned),
      },
    });
    return res.status(201).send({ok:"this user is now an admin in this group"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// admin removes himself from being an admin
router.post("/group/admin/removeSelf", async (req, res) => {
  const { id } = req.userInfo;
  let { groupId } = req.body;
  if (!groupId) {
    return res.status(400).send({ fail: "Missing groupId" });
  }
  try {
    const group = await GroupConversationsModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ fail: "No such group" });
    }
    if (!group.admins.some((admin) => admin == id)) {
      return res
        .status(400)
        .send({ fail: "You are not an admin in this group" });
    }
    if (group.admins.length === 1) {
      return res.status(400).send({
        fail: "You are the only admin in this group - you can't quit",
      });
    }

    await GroupConversationsModel.findByIdAndUpdate(groupId, {
      $pull: {
        admins: mongoose.Types.ObjectId(id),
      },
    });
    return res.status(200).send({ok:"successfuly unadminned you"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// member leaves group
router.post("/group/leave", async (req, res) => {
  const { id } = req.userInfo;
  let { groupId } = req.body;
  if (!groupId) {
    return res.status(400).send({ fail: "Missing groupId" });
  }
  try {
    let group = await GroupConversationsModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ fail: "No such group" });
    }
    if (!group.userIds.some((member) => member == id)) {
      return res.status(400).send({ fail: "You are not in this group" });
    }

    await GroupConversationsModel.findByIdAndUpdate(groupId, {
      $pull: {
        userIds: mongoose.Types.ObjectId(id),
        admins: mongoose.Types.ObjectId(id),
      },
    });

    // if group is left with no admin, and there are any members in this group,
    // make the first found member an admin

    group = await GroupConversationsModel.findById(groupId)

    if((group.admins.length===0) && (group.userIds.length!==0)){
      await GroupConversationsModel.findByIdAndUpdate(groupId, {
        $push: {
          admins: group.userIds[0]
        }
      })
    }

    return res.status(200).send({ok:"successfully removed you from this group"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// admin adds a member to the group
router.post("/group/addMember/:toBeAdded", async (req, res) => {
  const { id } = req.userInfo;
  let { groupId } = req.body;
  let { toBeAdded } = req.params;
  if (!groupId) {
    return res.status(400).send({ fail: "Missing groupId" });
  }
  try {
    let group = await GroupConversationsModel.findById(groupId);
    if (!group) {
      return res.status(400).send({ fail: "No such group" });
    }
    if (!group.admins.some((member) => member == id)) {
      return res.status(400).send({ fail: "You are not an admin in this group" });
    }

    await GroupConversationsModel.findByIdAndUpdate(groupId, {
      $push: {
        userIds: mongoose.Types.ObjectId(toBeAdded),
      },
    });

    return res.status(200).send({ok:"successfully added this user to this group"});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
