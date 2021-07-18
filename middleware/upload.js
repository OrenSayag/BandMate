const util = require("util");
const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/bandmate",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/mp3", "image/wav"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bandmate-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-bandmate-${file.originalname}`
    };
  }
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;