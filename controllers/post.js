const { Post } = require("../models/post");
const { User } = require("../models/user");
const ApiResponse = require('../models/api.response');


/**
 * search posts based on user input
 * 
 */
exports.getPostsWithQuery = async(req,res) =>{
  
  const filter = req.query.filter;
  let page =  1;
  const LIMIT = 10;

  //if no criteria return all posts
  //TODO: modify getPosts() using pagination or user the one done by deme
  if (!filter) {
    return getPosts(req, res);
  }  

/**
 *     SEARCH FOR POSTS WITH A QUERY
 * Search for the search comes form a registerd user 
 * if so we shall include his posts as well * 
 */   
  const user = await User.findById(req.query.id).select("-password");
  if (!user)
    return res.status(404).send("The poster user with the given ID was not found.");
    //if found, get the list of his followers and include him as well
    const following = user.following;
    following.push(req.params.id);

    const posts = Post.find({
                          owner: { $in: following },
                          content: { $regex: filter, $options: "i" },   //The option "$option : i" is used to avoid the case sensitivity.
                          isVisible: true,
                          })
                          .populate("owner")
                          .sort({postTime: "desc" })
                          .skip(LIMIT * page - LIMIT)
                          .limit(LIMIT)
                           .exec(); //=> {
                          //   return callback(err, posts);
                          // });
                          console.log("the fetched posts are: " + posts.result);
      return  res.status(200).send(new ApiResponse(200, 'success', posts));
}


//ACCESS A POST
exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post)
    return res.status(404).send("The post with the given ID was not found.");

  res.json(post);
};

//POST A POST
exports.createPost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  // use loadash's utility method pick and hash the password
  //imagePath = url+"/images/" + req.file.filename;
  // post = new Post(_.pick(req.body, ['owner','content']));
  const post = new Post({
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  });

  await post.save();
  res.status(201).json({
    message: "Post added successfully.",
    // postId: await savedPost._id
    post: {
      id: this.createPost._id,
      content: this.createPost.content,
      imagePath: this.createPost.imagePath,
    },
  });
};

//ACCESS ALL POSTS
exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    message: "Posts fetched succesfully.",
    posts: posts,
  });
};

//UPDATE A POST
exports.updatePost = async (req, res) => {
  let imagePath = req.body.image;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      // _id: req.body.id,
      content: req.body.content,
      owner: req.body.owner,
      imagePath: imagePath,
    },
    { new: true }
  );

  if (!post)
    return res.status(404).send("The post with the given ID was not found.");
  res.send(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findByIdAndRemove(req.params.id);

  if (!post)
    return res.status(404).send("The post with the given ID was not found.");

  res.status(200).json({ message: "Post deleted." });
};

/**
 * If user already liked the post, remove the like. If not, add into likes
 *
 *
 * REQUIRES: {
 *  postId: THE POST ID
 * }
 */
exports.likePost = async (req, res, next) => {
  // get user from request
  // get post from request body -- id
  const postId = req.body.postId;
  const user = req.user;
  if (!(postId && user)) {
    return res.status(404).json({ message: "Invalid request" });
  }
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.likedBy.indexOf(user._id) === -1) {
    // add the like
    Post.updateOne({ _id: post._id }, { $addToSet: { likedBy: user._id } });
  } else {
    // remove the like
    await Post.updateOne({ _id: post._id }, { $pull: { likedBy: user._id } });
  }
  res.status(200).json({ message: "Success" });
};

exports.dislikePost = async (req, res, next) => {
  // get user
};
