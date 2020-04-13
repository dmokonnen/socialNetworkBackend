const bcrypt = require('bcrypt');
const _ = require('lodash');
const util = require('util');
const path = require('path');
const multer = require('multer');

const {User, validate} = require('../models/user');
const accStatus = require('../constants/accstatus');
const {Post} = require('../models/post');


//ACCESS ALL USERS
exports.getUsers =   async (req, res,next) => {
    const users = await User.find().sort('name');
    res.send(users);
  };
//ACCESS A USER WITH ID
exports.getUserByEmail =  async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('The user with the given email was not found.');

  res.json({user});
};
//ACCESS A USER WITH ID
exports.getUser =  async (req, res) => {
  const user = await User.findById(req.params._id).select('-password');
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  if(user && user.accountStatus!=accStatus.ACTIVE) return "The account is deactivated.";
  if(user && user.accountStatus!=accStatus.DELETED) return "The account is deleted.";

  res.json({user});
};

//CREATE A NEW USER
exports.createUser  =  async (req, res) => {

  // use joi and validate the body contents(email, password....) are valid
  const {error}  = validate(req.body);                      
  console.log(error.details[0]);

  if (error) return res.status(400)
                        .send(error.details[0].message);
  // check if the user is already registerd! 
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  // save the user if all is okay
      /*user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }); 
      */
  // use loadash's utility method pick and hash the password
  user = new User(_.pick(req.body, ['lastName','firstName','userName', 'birthDate','gender',
                                    'email', 'password', 'profilePic','address','accountStatus','isAdmin']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken(); 
  res.header('x-auth-token', token) // custome token added 
     .send(_.pick(user, ['_id', 'userName', 'email', 'isAdmin']));
};
            
//UPDATE A USER
exports.updateUser = async (req,res)=>{

      // use joi and validate the body contents(email, password....) are valid
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id,{
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
    },{new: true
      })

    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
};

//DELETE A USER
exports.deleteUser  = async (req,res)=>{
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
};

// ******************** FOR front end test ***********************



//ACCESS A POST
exports.getPost =  async (req, res) => {
  const  post = await Post.findById(req.params.id);
  if (!post) return  res.status(404).send('The post with the given ID was not found.');

  res.json(post);
};

//POST A POST
exports.createPost  =  async (req, res,next) => {

  const url = req.protocol+'://' + req.get("host");

  // use loadash's utility method pick and hash the password
  //imagePath = url+"/images/" + req.file.filename;
  // post = new Post(_.pick(req.body, ['owner','content']));
  const post = new Post({
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
      
  await post.save();
  res.status(201).json({
      message:'Post added successfully.',
      // postId: await savedPost._id
      post:{
        id: this.createPost._id,
        content: this.createPost.content,
        imagePath:  this.createPost.imagePath
      }
    });
};

//ACCESS ALL POSTS
exports.getPosts =   async (req, res,next) => {
  const posts = await Post.find();
  res.status(200).json({
    message:'Posts fetched succesfully.',
    posts:posts
  });
};

//UPDATE A POST
exports.updatePost = async (req,res)=>{
let imagePath = req.body.image;
if(req.file){
  const url = req.protocol+'://' + req.get("host");
  imagePath = url + "/images/" + req.file.filename;

}
const post = await Post.findByIdAndUpdate(req.params.id,{
    // _id: req.body.id,
    content: req.body.content,
    owner: req.body.owner,
    imagePath:imagePath
},{new: true
  })

if (!post) return res.status(404).send('The post with the given ID was not found.');
res.send(post);
};

exports.deletePost = async (req,res)=>{
  const post = await Post.findByIdAndRemove(req.params.id);

  if (!post) return res.status(404).send('The post with the given ID was not found.');

  res.status(200).json({message:'Post deleted.'});
}


// ******************** FOR front end test ***********************

//BE FOLLOWER
exports.followUser =  async (req, res) => {

  const  userId = req.body._id;
  const  followerId = req.body.following._id; //?????
  const user = await User.findOneAndUpdate({ _id: userId },{ $push: { following: followerId }});
  await User.findOneAndUpdate({ _id: followerId },{ $push: { followers: userId}});

  return res.send(user);
};

exports.deleteFollowing = async (req, res) => {
const  userId = req.body._id;
const  followerId = req.body.following._id; //????
const user = await User.findOneAndUpdate({ _id: userId },{ $pull: { following: followerId }});
await User.findOneAndUpdate({ _id: followerId },{ $pull: { followers: userId}});

return res.send(user);
};