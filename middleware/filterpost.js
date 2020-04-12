
const {UnhealthyWords, validateUnhealthylist} = require('../models/unhealthywordslist');

//everytime there is a post run this middleware.....
module.exports = async function (req, res, next) {

//  const {error}  = validatePost(req.body);                      
  //if (error) return res.status(400).send(error.details[0].message);
  
  const unhealthyWords = await UnhealthyWords.findOne();
  const blockedWordList = unhealthyWords.wordlist;

  const isUnhealthy = searchUnhealthyWord(req.body.content,blockedWordList);
  console.log("bad word is found: ", isUnhealthy);

  //Bad word detected: change post health and visibility status and notify admin
  if(isUnhealthy){
    req.body.hasUnhealthy = true;
    req.body. isVisible= false;
  } 
  //TODO:send email to admin for notification

  next();
}

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
    dbWordList = JSON.stringify(dbWordList);
    userWord = userWord.trim().split(" ");
    userWord = userWord.map(w=>w.toLowerCase());
  return userWord.some(word => dbWordList.includes(word)) 
} 


