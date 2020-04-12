const {User} = require('../models/user');
const {Post} = require('../models/post');
const accStatus = require('../constants/accstatus');

//check the guy who just posted has 20 unhealthy posts
//if so deactivate it

module.exports = async function (req, res, next) {

    const user = await User.findById(req.body.owner);

   // user.unhealthyPostNo++;
    //TODO: for test purpose set to 1 change it to 20
   // if(user.unhealthyPostNo%1===0)   user.accountStatus = accStatus.DEACTIVATED; 
    //console.log(user)

    //TODO:send email to user for notification

    next();
  }
