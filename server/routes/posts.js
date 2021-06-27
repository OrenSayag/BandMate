const PostsModel = require("../DB/models/posts");
const UsersModel = require("../DB/models/users");
const router = require("express").Router();



// test
router.get("/", async (req, res) => {
  return res.send("/posts works!")
});

// post new post
router.post("/" ,async (req, res) => {
  const { id } = req.userInfo;
  const { title, content, isPrivate } = req.body;
    if(!title || !content) {
        return res.status(400).send({fail:"Missing title || content || isPrivate"})
    }
  try {
    const post = await new PostsModel({
        title,
        content,
        parentUser: id,
        date: new Date(),
        isPrivate,
        type: "post"
    })

    await post.save()

    const user = await UsersModel.findById(id);
    user.logs.push(post._id)
    console.log(post._id)
    return res.sendStatus(201)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


module.exports = router;