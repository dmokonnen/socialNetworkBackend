const userController = require("../controllers/user");
const postController = require("../controllers/post");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const uploadController = require('../controllers/upload');
const fliter = require('../middleware/filterpost');
const deactivateaccount = require('../middleware/deactivateaccount');
 
router.post('/forgot-password', userController.getUserByEmail); 
router.get('/', [auth,admin], userController.getUsers);

router.get('/:id', auth, userController.getUser); 
router.post('/add-user', userController.createUser); // SIGNUP NEEDS NO AUTH
router.put('/edit-user/:id', auth, userController.updateUser);
router.delete('/delete-user/:id', [auth, admin], userController.deleteUser);
=======
const uploadController = require("../controllers/upload");
const fliter = require("../middleware/filterpost");
const deactivateaccount = require("../middleware/deactivateaccount");

router.get("/", [auth, admin], userController.getUsers);
router.get("/me", auth, userController.getUser);
router.post("/add-user", userController.createUser);
router.put("/edit-user/:id", auth, userController.updateUser);
router.delete("/delete-user/:id", [auth, admin], userController.deleteUser);
>>>>>>> 14aa667af0e40c7f6640779a0498e72d65a4217c
// router.post('/create-post', [fliter,deactivateaccount], userController.createPost);
router.post("/followe-user", userController.followUser);
router.post("/unfollowe-user", userController.deleteFollowing);

// ******************** FOR front end test ***********************
router.get("/get-post/:id", postController.getPost);
router.get("/get-posts", postController.getPosts);
router.post(
  "/add-post",
  [uploadController.singleUpload, fliter, deactivateaccount],
  postController.createPost
);
router.put(
  "/edit-post/:id",
  [uploadController.singleUpload, fliter, deactivateaccount],
  postController.updatePost
);
router.delete("/delete-post/:id", postController.deletePost);
// ******************** FOR front end test ***********************

//TODO: image resize remaining
router.post("/profile-image-upload", uploadController.singleUpload); // RESIZE?? or do it at fron css
router.post("/comment-post", uploadController.singleUpload);
router.post("/uncomment-post", uploadController.singleUpload);
router.post("/like-post", uploadController.singleUpload);
router.post("/unlike-post", uploadController.singleUpload);

module.exports = router;
