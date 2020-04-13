const { Post } = require("../models/post");

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
