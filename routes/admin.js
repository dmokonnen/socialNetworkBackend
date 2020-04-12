const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../controllers/admin');
const uploadController = require('../controllers/upload');

router.use([auth,admin]);
router.get('/all-users',adminController.getUsers);
router.delete('/delete-user/:id' , adminController.deleteUser);
router.put('/deactivate-user/:id', adminController.deactivateUser);
router.put('/activate-user/:id',adminController.activateUser);
router.post('/push-advert',adminController.pushAdvert);
router.get('/get-advert',adminController.getAdvert);
router.post("/advert-images-upload", uploadController.multipleUpload);
router.post('/create-unhealthy-word',adminController.createUnhealthyWord);
//router.post('/add-unhealthy-word',adminController.createUnhealthyWord);

//TO DO: admin post related tasks
router.post('/post-enable',adminController.getAdvert);
router.post('/post-disable',adminController.getAdvert);
router.get('/unhealthy-post',adminController.getAdvert);

module.exports = router;


