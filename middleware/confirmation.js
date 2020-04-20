const jwt = require("jsonwebtoken");
const config = require('config');
const { User } = require("../models/user");



module.exports = async (req,res,next) => {

    const url = 'http://localhost:3000/login';
    let user={};
    try{
        const token = req.params.token; 
         user  = jwt.verify(token, config.get('jwtPrivateKey'));  
        console.log("the user is ", user._id); 
        await User.findByIdAndUpdate({_id:user._id}, { isConfirmed:true}, { new: true });
    }catch(e){
        res.send("error " + e);
    }
console.log("INSIDE CONFIRMATION, USER CONFIRMED");
  // return res.status(200).send(new ApiResponse(200, 'success', user) ); 
 // return user;
}
