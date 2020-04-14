const util = require('util');
const path = require('path');
const multer = require('multer');

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const storage = multer.diskStorage({
  
  destination: (req, file, callback) => {
    callback(null, path.join('${__dirname}/../images'));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg", "image/jpg"];

    console.log(file.mimetype);
    if (match.indexOf(file.mimetype) === -1) {
      const message = `${file.originalname} Image is invalid. Only png/jpg/jpeg are accepted.`;
      return callback(message, null);
    }
    
    const name = file.originalname
    .toLowerCase()
    .split(" ")
    .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    const filename = name + Date.now() + '.'+ext;

    callback(null, filename);
    //callback(null, "c://testpic")
  }
});

 const uploadFiles = multer({ storage: storage }).single("image");
 const uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;