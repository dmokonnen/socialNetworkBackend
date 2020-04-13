const bcrypt = require("bcrypt");
const _ = require("lodash");
const util = require("util");
const path = require("path");
const multer = require("multer");

const { User, validate } = require("../models/user");
const accStatus = require("../constants/accstatus");

//ACCESS ALL USERS
exports.getUsers = async (req, res, next) => {
  const users = await User.find().sort("name");
  res.send(users);
};

//ACCESS A USER
exports.getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  if (user && user.accountStatus != accStatus.ACTIVE)
    return "The account is deactivated.";
  if (user && user.accountStatus != accStatus.DELETED)
    return "The account is deleted.";

  res.json({ user });
};

//CREATE A NEW USER
exports.createUser = async (req, res) => {
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
  res
    .header("x-auth-token", token) // custome token added
    .send(_.pick(user, ["_id", "userName", "email", "isAdmin"]));
};

//UPDATE A USER
exports.updateUser = async (req, res) => {
  // use joi and validate the body contents(email, password....) are valid
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
};

//DELETE A USER
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
};

// ******************** FOR front end test ***********************

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
