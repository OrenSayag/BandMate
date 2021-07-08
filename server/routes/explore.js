const LogsModel = require("../DB/models/logs");
const RecordingsModel = require("../DB/models/recordings");
const PostsModel = require("../DB/models/posts");
const UsersModel = require("../DB/models/users");
const jwt = require("jsonwebtoken");
const FsFilesModel = require("../DB/models/fs.files");
const FsChunksModel = require("../DB/models/fs.chunks");
const mongoose = require("mongoose")

const router = require("express").Router();

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
    return res.send({ error: "invalid token" });
  }
};

// gets top data based on likes
router.post("/", async (req, res) => {
  const { genreId, contentType } = req.body;

  console.log(genreId);
  console.log(contentType);

  if (!contentType || !genreId) {
    return res.status(400).send({ fail: "missing contentType || genreId" });
  }

  try {
    // from each content model, get the first hundred logs and sort by amount of likes.
    // concat all top data into one
    // const allLogs = await LogsModel.find();
    // const allRecordings = await RecordingsModel.find();
    // const allPosts = await PostsModel.find();

    // const hugeExplore = {
    //   allLogs,
    //   allRecordings,
    //   allPosts,
    // };

    // let filteredData = [];

    // switch (filter) {
    //   case "bands":
    //     // get top bands based on followers. (or all as we start)
    //     filteredData = await UsersModel.find(
    //       { isBand: true },
    //       {
    //         hashedPass: 0,
    //         logCategories: 0,
    //         mail: 0,
    //       }
    //     );
    //     break;

    //   default:
    //     break;
    // }

    // filter relevant data type by genre
    let content;
    if (genreId === "all") {
      switch (contentType) {
        case "bands":
          content = await UsersModel.find({
            isBand: true,
          }).populate("genres");
          // .populate("instruments")
          break;
        case "users":
          content = await UsersModel.find({
            isBand: false,
          }).populate("genres");
          // .populate("instruments")
          break;
        case "recordings":
          content = await RecordingsModel.find({
            isPrivate: false,
          })
            .populate("parentUser")
            .populate("parentUser.participants");
          break;
        case "all":
          const users = await UsersModel.find({}).populate("genres");
          // .populate("instruments")
          const recordings = await RecordingsModel.find({})
            .populate("parentUser")
            .populate("parentUser.participants");
          content = users.concat(recordings);
          break;
        default:
          return res.status(400).send({ fail: "recieved wrong content type" });
          break;
      }
    } else {
      switch (contentType) {
        case "bands":
          content = await UsersModel.find({
            isBand: true,
            genres: genreId,
          }).populate("genres");
          // .populate("instruments")
          break;
        case "users":
          content = await UsersModel.find({
            isBand: false,
            genres: genreId,
          }).populate("genres");
          // .populate("instruments")
          break;
        case "recordings":
          content = await RecordingsModel.find({
            isPrivate: false,
            genres: genreId,
          })
            .populate("parentUser")
            .populate("parentUser.participants");
          break;
        case "all":
          const users = await UsersModel.find({
            genres: genreId,
          }).populate("genres");
          // .populate("instruments")
          const recordings = await RecordingsModel.find({
            genres: genreId,
          })
            .populate("parentUser")
            .populate("parentUser.participants");
          content = users.concat(recordings);
          break;

        default:
          return res.status(400).send({ fail: "recieved wrong content type" });
          break;
      }
    }

    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    content = shuffle(content);

    return res
      .status(200)
      .send({ content, ok: "successfily fetched data for explore list" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// gets an individual content data
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const log = await LogsModel.findById(id);
    const post = await PostsModel.findById(id);
    const recording = await RecordingsModel.findById(id);
    if (log) {
      return res.status(200).send(log);
    } else if (post) {
      return res.status(200).send(post);
    } else if (recording) {
      return res.status(200).send(recording);
    }

    return res.status(200).send({ fail: "No such content" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("send normal mongo id");
  }
});

// gets an list of matches based on search value
router.get("/search/:value", async (req, res) => {
  const { value } = req.params;
  if (!value) {
    return res.status(400).send({ fail: "send some value" });
  }
  console.log(value);
  try {
    // const logs = await LogsModel.find({
    //   title: { $regex: value, $options: "i" },
    // });
    // const posts = await PostsModel.find({
    //   title: { $regex: value, $options: "i" },
    //   content: { $regex: value, $options: "i" },
    // });
    // const recordings = await RecordingsModel.find({
    //   title: { $regex: value, $options: "i" },
    // });
    const posts = [];
    const recordings = [];
    const logs = [];
    const users = await UsersModel.find({
      $and: [{ username: { $regex: value, $options: "i" } }, { isBand: false }],
    });
    const bands = await UsersModel.find({
      $and: [{ username: { $regex: value, $options: "i" } }, { isBand: true }],
    });

    return res.status(200).send({ logs, posts, recordings, users, bands });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

router.delete("/killContent/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  const userId  = req.userInfo.id;
  // console.log(req.userInfo)

  try {
    const log = await LogsModel.findById(id);
    const recording = await RecordingsModel.findById(id);
    const post = await PostsModel.findById(id);

    if (log) {
      const parentUser = await UsersModel.findById(log.parentUser);
      if (
        log.parentUser != userId &&
        !parentUser.participants.some((p) => p.userId == userId)
      ) {
        return res
          .status(400)
          .send({ fail: "This log is not yours to delete" });
      }

      await LogsModel.findByIdAndDelete(id);
      return res.status(200).send({ok:"successfully deleted this log"})
    }



    if (recording) {
      const parentUser = await UsersModel.findById(recording.parentUser);
      if (
        recording.parentUser != userId &&
        !parentUser.participants.some((p) => p.userId == userId)
      ) {
        return res
          .status(400)
          .send({ fail: "This recording is not yours to delete" });
      }

      await FsFilesModel.findByIdAndDelete(recording.fileSrc);
      await FsChunksModel.find({
        files_id: await mongoose.Types.ObjectId(recording.fileSrc),
      });

      await RecordingsModel.findByIdAndDelete(id);
      return res.status(200).send({ok:"successfully deleted this recording"})

    }

    if (post) {
      const parentUser = await UsersModel.findById(post.parentUser);
      // console.log(userId)
      if (
        post.parentUser != userId &&
        !parentUser.participants.some((p) => p.userId == userId)
      ) {
        return res
          .status(400)
          .send({ fail: "This post is not yours to delete" });
      }

      if(post.fileSrc){
        await FsFilesModel.findByIdAndDelete(post.fileSrc);
        await FsChunksModel.find({
          files_id: await mongoose.Types.ObjectId(post.fileSrc),
        });
      }

      await PostsModel.findByIdAndDelete(id);
      return res.status(200).send({ok:"successfully deleted this post"})

    }
    return res.status(400).send({fail:"No such post"})
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  // const parentUser = await UsersModel.findById(recording.parentUser)
  // if((recording.parentUser!=userId && !parentUser.participants.some(p=>p.userId==userId))){

  //   return res.status(400).send({ fail: "This recording is not yours to delete" });
  // }
});

module.exports = router;
