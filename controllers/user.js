const bcrypt = require("bcryptjs");
const _ = require("lodash");
const util = require("util");
const path = require("path");
const multer = require("multer");
const ApiResponse = require('../models/api.response');
const { User, validate } = require("../models/user");
const accStatus = require("../constants/accstatus");

//ACCESS ALL USERS
exports.getUsers = async (req, res, next) => {
  const users = await User.find().sort("name");
  res.send(users);
};

//ACCESS A USER
exports.getUser = async (req, res) => {

  const user = await User.findById(req.params.id).select("-password");
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  if (user && user.accountStatus === accStatus.DEACTIVATED){
    
    console.log("the user is deactive");
    return "The account is deactivated.";
  }
    
  if (user && user.accountStatus === accStatus.DELETED){
    onsole.log("the user is deleted");
    return "The account is deleted.";
}
console.log("the user is : " + user);

  res.status(200).send(new ApiResponse('200','success',user));
};

//CREATE A NEW USER
exports.createUser = async (req, res,next) => {
  // use joi and validate the body contents(email, password....) are valid
  const { error } = validate(req.body);
  //console.log(error.details);

  if (error) return res.status(400).send(error.details[0].message);
  // check if the user is already registerd!
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // save the user if all is okay
  /*user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }); 
      */
  // use loadash's utility method pick and hash the password
  user = new User(
    _.pick(req.body, [
      "lastName",
      "firstName",
      "userName",
      "birthDate",
      "email",
      "password",
      "isConfirmed",
      "profilePic",
      "address",
      "accountStatus",
      "isAdmin",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  req.header.token = token;
    // NOW LETS SEND A VERIFICATION LINK
      next();
  res
    .header("x-auth-token", token) // custome token added
    .send(_.pick(user, ["_id", "userName", "email", "isAdmin", "isConfirmed"]));


};

//UPDATE A USER
exports.updateUser = async (req, res) => {
  // use joi and validate the body contents(email, password....) are valid
 // const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
     {_id:req.params.id},
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      address:req.body.address
      
      // [{
      //     country:req.body.address.country,
      //     state:req.body.address.sstate,
      //     city:req.body.address.city,
      //     zipCode:req.body.zipCode
      // }]
    


    },
    { new: true }
  );  

     return  res.status(200).send(new ApiResponse(200, 'success', user));

};

//DELETE A USER
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
};

//BE FOLLOWER
exports.followUser = async (req, res) => {
  const userId = req.body._id;
  const followerId = req.body.following._id; //?????
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $push: { following: followerId } }
  );
  await User.findOneAndUpdate(
    { _id: followerId },
    { $push: { followers: userId } }
  );

  return res.send(user);
};

exports.deleteFollowing = async (req, res) => {
  const userId = req.body._id;
  const followerId = req.body.following._id; //????
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { following: followerId } }
  );
  await User.findOneAndUpdate(
    { _id: followerId },
    { $pull: { followers: userId } }
  );

  return res.send(user);
};
