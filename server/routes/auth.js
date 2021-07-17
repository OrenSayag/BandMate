const router = require("express").Router();
require('dotenv').config()

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UsersModel = require("../DB/models/users");
const instrumentModel = require("../DB/models/instruments");
const GenresModel = require("../DB/models/genres");
const upload = require("../middleware/upload");


// mongoose.set('debug', true);

// oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.   ooooooooooooo ooooo   .oooooo.   ooooo      ooo  .oooooo..o
// `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b  8'   888   `8 `888'  d8P'  `Y8b  `888b.     `8' d8P'    `Y8
//  888          888       8   8 `88b.    8  888               888       888  888      888  8 `88b.    8  Y88bo.
//  888oooo8     888       8   8   `88b.  8  888               888       888  888      888  8   `88b.  8   `"Y8888o.
//  888    "     888       8   8     `88b.8  888               888       888  888      888  8     `88b.8       `"Y88b
//  888          `88.    .8'   8       `888  `88b    ooo       888       888  `88b    d88'  8       `888  oo     .d8P
// o888o           `YbodP'    o8o        `8   `Y8bood8P'      o888o     o888o  `Y8bood8P'  o8o        `8  8""88888P'
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePassword(str) {
  // min 8 letter password, upper and lower case letters and a number
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
}
function validateUserName(str) {
  const re = /^(?=[a-zA-Z0-9._]{4,10}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  return re.test(str);
}

// ooooooooo.     .oooooo.   ooooo     ooo ooooooooooooo oooooooooooo  .oooooo..o
// `888   `Y88.  d8P'  `Y8b  `888'     `8' 8'   888   `8 `888'     `8 d8P'    `Y8
//  888   .d88' 888      888  888       8       888       888         Y88bo.
//  888ooo88P'  888      888  888       8       888       888oooo8     `"Y8888o.
//  888`88b.    888      888  888       8       888       888    "         `"Y88b
//  888  `88b.  `88b    d88'  `88.    .8'       888       888       o oo     .d8P
// o888o  o888o  `Y8bood8P'     `YbodP'        o888o     o888ooooood8 8""88888P'
router.post("/register", async (req, res) => {
  // validate req data is valid
  const {
    isBand,
    fname,
    lname,
    userName,
    mail,
    password,
    instruments,
    genres,
    profile_img_src
  } = req.body;


  if (isBand === undefined || !password || !mail || !userName) {
    return res.status(401).send({ fail: "Missing Some Info" });
  }

  if (!isBand && (!fname || !lname)) {
    return res.status(401).send({ fail: "Missing Some Info" });
  }

  // validate mail and password and userName format
  if (!validateEmail(mail)) {
    return res.status(401).send({ fail: "Wrong Mail Format" });
  }
  if (!validatePassword(password)) {
    return res.status(401).send({
      fail: "Weak Password. Rules: Minimum 8 character password, upper and lower case letters and a number",
    });
  }
  if (!validateUserName(userName)) {
    return res.status(401).send({
      fail: "Invalid userName. Rules: 4-10 characters, no _ or . at the beginning or end, no double special characters (._), allowed characters: - . , a-z, A-Z, 0-9",
    });
  }

  // validate user_name or mail aren't taken
  try {
    if(instruments){
      if(!Array.isArray(instruments)){
        return res.status(400).send({fail:"send instruments as an array"})
      }
      for (const instrument of instruments) {
        if(await instrumentModel.findById(instrument)===null){
          return res.status(400).send({fail:"recieved invalid instrument"})
        }
      }
    }

    if(genres){
      if(!Array.isArray(genres)){
        return res.status(400).send({fail:"send genres as an array"})
      }
      for (const genre of genres) {
        if(await GenresModel.findById(genre)===null){
          return res.status(400).send({fail:"recieved invalid genre"})
        }
      }
    }


    let results = await UsersModel.find({ username: userName });
    // console.log(results)

    if (results.length !== 0) {
      return res.status(400).send({ taken: "Username is taken" });
    }
    results = await UsersModel.find({ mail });
    // console.log(results)




    if (results.length !== 0) {
      return res.status(400).send({ taken: "Mail is taken" });
    }

    // add user to db

    const hashedPass = await bcrypt.hashSync(password, 10);

    if (!isBand) {
      await UsersModel.create({
        username: userName,
        fname,
        lname,
        mail,
        hashedPass,
        instruments,
        genres,
        isBand,
        profile_img_src
      });
    } else {
      await UsersModel.create({
        username: userName,
        mail,
        hashedPass,
        instruments,
        genres,
        isBand,
        profile_img_src
      });
    }

    return res.status(200).send({ok:"new user created"})
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error });
  }
});

router.post("/login", async (req, res) => {
  // save data
  const { mailOrUsername, password } = req.body;
  // validate data true
  if (!mailOrUsername || !password) {
    return res.status(400).send({ fail: "missing mailOrUsername || password" });
  }
  // check match in db
  try {
    let goose = await UsersModel.find({
      $or: [{ username: mailOrUsername }, { mail: mailOrUsername }],
    })
    .populate("bands")
    .populate("participants.userId")
    .populate("instruments")

    ;

    if (goose.length === 0) {
      return res.status(401).send({ failAndDisplay: "No such user or mail" });
    }

    const hashed_pass = goose[0].hashedPass;

    const verifyPass = await bcrypt.compareSync(password, hashed_pass);
    if (!verifyPass) {
      return res.status(401).send({ failAndDisplay: "Wrong password" });
    }


    const token = jwt.sign(
      {
        userInfo: {
          username: goose[0].username,
          fname: goose[0].fname,
          lname: goose[0].lname,
          mail: goose[0].mail,
          profile_img_src: goose[0].profile_img_src,
          cover_img_src: goose[0].cover_img_src,
          instruments: goose[0].instruments,
          bio: goose[0].bio,
          bands: goose[0].bands,
          isBand: goose[0].isBand,
          participants: goose[0].participants,
          id: goose[0]._id,

        },
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 8 * 60 * 60,
      }
    );

    

    return res.status(200).send({ ok:token });
  } catch (error) {
      console.log(error)
    return res.sendStatus(500)
  }
});


// upload file
router.post("/uploadProfilePicture", async (req, res) => {
  try{
  await upload(req, res);
    
  console.log("runningn");
  // console.log(req.file.id)
  if (req.file == undefined) {
    return res.send({fail:`No profile image uploaded.`});
  }

  return res.send({ok:`File ${req.file.id} has been uploaded.`,
                   fileId: req.file.id
});
} catch (error) {
  console.log(error);
  return res.send({fail:`Error when trying upload image: ${error}`});
}
});

router.get("/", (req, res) => {
  return res.send("test");
});

module.exports = router;
