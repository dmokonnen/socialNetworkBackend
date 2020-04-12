const upload = require("../middleware/upload");

//for uploading multiple images for advertisment
exports.multipleUpload = async (req, res) => {
  try {
    console.log("inside upload controller: ", req.body)
    await upload(req, res);

    if (req.file <= 0) {
      return res.send(`You must select at least 1 file.`);
    }

    return res.send(`Files has been uploaded.`);
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

//for uploading profile pics - only 1 pictures
exports.singleUpload = async (req, res,next) => {
    try {
      await upload(req, res);
  
      if (!req.file) {
        return res.send(`You must select a file.`);
      }
      
      next();
      //return res.status(200).json({message:'Files has been uploaded.'});
    } catch (error) {
      console.log(error);  

      return res.send(`Error when trying upload files: ${error}`);
    }
  };
