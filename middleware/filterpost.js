const {
  UnhealthyWords,
  validateUnhealthylist,
} = require("../models/unhealthywordslist");
const { push } = require("../util/pushNotification.js");
const { User } = require("../models/user");

//everytime there is a post run this middleware.....
module.exports = async function (req, res, next) {
  //  const {error}  = validatePost(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  const unhealthyWordsQuery = await UnhealthyWords.find();
  let unhealthyWords = [];
  unhealthyWordsQuery.forEach((word) => unhealthyWords.push(word.word));
  const isUnhealthy = searchUnhealthyWord(req.body.content, unhealthyWords);

  //Bad word detected: change post health and visibility status and notify admin
  if (isUnhealthy) {
    req.body.hasUnhealthy = true;
    req.body.isVisible = false;
    // Notify admins about unhealthy posts
    User.find({ isAdmin: true })
      .then((adminObjects) => {
        admins = [];
        adminObjects.forEach((admin) => admins.push(admin._id));
        push(admins, req.body, 0);
      })
      .catch(next);
  }
  next();
};

function searchUnhealthyWord(userWord, dbWordList) {
  //Change JSON object to array
  /*
    let result = [];
    let keys = Object.keys(arr2);
    keys.forEach(function(key){
        result.push(arr2[key]);
        console.log(arr2[key])
    });
    */
  //console.log( arr1.trim().split(" "));
  userWord = userWord.trim().split(" ");
  userWord = userWord.map((w) => w.toLowerCase());
  return userWord.some((word) => dbWordList.includes(word));
}
