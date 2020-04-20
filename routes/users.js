const userController = require("../controllers/user");
const postController = require("../controllers/post");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");
const fliter = require("../middleware/filterpost");
const deactivateaccount = require("../middleware/deactivateaccount");
const nodemailerverifyEmail = require("../middleware/nodemailer");
const confirmation = require('../middleware/confirmation');


router.get("/", [auth, admin], userController.getUsers);
//TODO: image resize remaining
router.post("/profile-image-upload", uploadController.singleUpload); // RESIZE?? or do it at fron css
router.get("/:id", auth, userController.getUser);

//USER ROUTE
router.post("/add-user", userController.createUser, nodemailerverifyEmail);
router.get("/confirmation/:token", confirmation);
router.put("/edit-user/:id", auth, userController.updateUser);
router.delete("/delete-user/:id", [auth, admin], userController.deleteUser);
// router.post('/create-post', [fliter,deactivateaccount], userController.createPost);
router.post("/follow-user", userController.followUser);
router.post("/unfollow-user", userController.deleteFollowing);
            
//POST ROUTES
router.get("/get-posts/search", postController.getPostsWithQuery);
router.get("/get-post/:id", postController.getPost);
router.get("/get-posts", postController.getPosts);
<<<<<<< HEAD
router.post( "/add-post", [uploadController.singleUpload, auth,fliter, deactivateaccount], postController.createPost);
router.delete("/delete-post/:id", postController.deletePost);
router.post("/comment-post", auth, postController.commentPost);
router.put( "/edit-post/:id", [auth, uploadController.singleUpload, fliter, deactivateaccount],postController.updatePost);
//TODO
=======
router.post("/add-post",[auth,uploadController.singleUpload],postController.createPost);
// router.post( "/add-post", [uploadController.singleUpload, fliter, deactivateaccount], postController.createPost);
router.put(
  "/edit-post/:id",
  [auth, uploadController.singleUpload, fliter, deactivateaccount],
  postController.updatePost
);

router.delete("/delete-post/:id", postController.deletePost);

//TODO: image resize remaining
// router.post("/comment-post", uploadController.singleUpload);
router.post("/comment-post", postController.commentPost);
router.post("/uncomment-post", uploadController.singleUpload);
>>>>>>> 6290b6e0de70af3b82c7c16f9cedb4c0a72dca97
router.post("/like-post", uploadController.singleUpload);

module.exports = router;
