const userController = require("../controllers/user");
const postController = require("../controllers/post");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");
const fliter = require("../middleware/filterpost");
const deactivateaccount = require("../middleware/deactivateaccount");

router.get("/", [auth, admin], userController.getUsers);
//TODO: image resize remaining
router.post("/profile-image-upload", uploadController.singleUpload); // RESIZE?? or do it at fron css
router.get("/me", auth, userController.getUser);

router.post("/add-user", userController.createUser);
router.put("/edit-user/:id", auth, userController.updateUser);
router.delete("/delete-user/:id", [auth, admin], userController.deleteUser);
// router.post('/create-post', [fliter,deactivateaccount], userController.createPost);
router.post("/follow-user", userController.followUser);
router.post("/unfollow-user", userController.deleteFollowing);

router.get("/get-post/:id", postController.getPost);
router.get("/get-posts", postController.getPosts);
router.post("/add-post",[auth,uploadController.singleUpload],postController.createPost);
// router.post( "/add-post", [uploadController.singleUpload, fliter, deactivateaccount], postController.createPost);
router.put(
  "/edit-post/:id",
  [auth, uploadController.singleUpload, fliter, deactivateaccount],
  postController.updatePost
);

router.delete("/delete-post/:id", postController.deletePost);

//TODO: image resize remaining
router.post("/comment-post", uploadController.singleUpload);
router.post("/uncomment-post", uploadController.singleUpload);
router.post("/like-post", uploadController.singleUpload);
router.post("/unlike-post", uploadController.singleUpload);

module.exports = router;
