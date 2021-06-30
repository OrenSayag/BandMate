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

  console.log(req.userInfo.username);

  if (!to || !content) {
    return res.status(400).send({ fail: "Missing to || content" });
  }
  if (id === to) {
    return res.status(400).send({ fail: "Don't send a message to yourself." });
  }
  try {
    //  check if we're talking join req, if not, continue normally on sending the messaeg
    if (isJoinReq) {
      console.log("is join req");
      const fromWho = await UsersModel.findById(id);
      const toWho = await UsersModel.findById(to);
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

        if (band.participants.some((p) => p.username == to)) {
          return res
            .status(400)
            .send({ fail: "This user is already in your band" });
        }
      } else {
        const band = await UsersModel.findById(to);
        console.log(band);
        console.log(to);
        if (band.participants.some((p) => p.username == id)) {
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

      await newMessage.save();

      return res.sendStatus(201);
    }

    
    if (
      (await UsersModel.findById(to)) === null &&
      (await GroupConversationsModel.findById(to)) === null
      ) {
        return res.status(400).send({ fail: "No such user or group" });
      }
      
      let newMessage;

      if(await GroupConversationsModel.findById(to)===null){
        newMessage = await new MessagesModel({
          content,
          from: id,
          to,
          type: "message",
        });
      } else {
        newMessage = await new MessagesModel({
          content,
          from: id,
          to,
          type: "group message",
        });
      }

      await newMessage.save();
      
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get user's conversations
router.get("/", async (req, res) => {
  const { id } = req.userInfo;
  try {
    const userGroups = await GroupConversationsModel.find({userIds: id})
    const userGroupsIds = []
    for (const group of userGroups) {
      userGroupsIds.push(group._id)
    } 
    console.log(userGroupsIds)
    const conversation = await MessagesModel.find({
      $or: [{ from: id }, { to: id },{ to: {$in:userGroupsIds} }],
    }).sort("date");

    // organize coversations by contact name, and by groups
    let conversations = {};
    for (const message of conversation) {
      if(message.type=="group message"){
        // console.log("hey this is a group message")
        if(!conversations[message.to]){
          conversations[message.to] = []
        }
        conversations[message.to].push(message)
      } else {
        if (message.from != id) {
          if (!Array.isArray(conversation[message.from])) {
            conversation[message.from] = [];
          }
          conversation[message.from].push(message);
        } else {
          if (!Array.isArray(conversation[message.to])) {
            conversation[message.to] = [];
          }
          conversation[message.to].push(message);
        }
      }
      }

    return res.status(200).send({ conversations });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// reply to a join request
router.put("/replyJoinRequest/:messageId", async (req, res) => {
  const { id, isBand } = req.userInfo;
  const { messageId } = req.params;
  const { bandId, toBeAddedUserId, answer } = req.body;

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
      return res.sendStatus(200);
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

    return res.sendStatus(200);
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

    return res.sendStatus(200);
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

    await group.save();

    return res.sendStatus(201);
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
    return res.sendStatus(200);
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
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// admin removes himself from being an admin
router.delete("/group/admin/removeSelf", async (req, res) => {
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
      return res
        .status(400)
        .send({
          fail: "You are the only admin in this group - you can't quit",
        });
    }

    await GroupConversationsModel.findByIdAndUpdate(groupId, {
      $pull: {
        admins: mongoose.Types.ObjectId(id),
      },
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
