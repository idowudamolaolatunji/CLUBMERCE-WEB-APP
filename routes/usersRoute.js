const express = require('express')
const multer = require('multer');

const authController = require("../controller/authcontroller");
const userController = require("../controller/usersController");


const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-email/:token", authController.verifyEmail);
router.get('/logout', authController.logout)
router.post("/login-buyer", authController.loginBuyer);
router.post("/signup-buyer", authController.signup);
;
router.post("/login", authController.login);
router.post("/login-admin", authController.loginAdmin);

router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)

router.get("/getMe", authController.protect, userController.getMe);
// router.patch("/uploadImage", authController.protect, userController.uploadProfilePicture);
router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch("/updateMyBank", authController.protect, userController.updateBankDetails);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.patch("/uploadProfileImage", authController.protect, userController.userPhotoUpload, userController.resizeUserImage, userController.uploadProfilePicture);

router.delete("/deleteAccount", authController.protect, userController.deleteAccount);


 
router
.route('/')
  .get(authController.protect, userController.getAllUser)
  .post(authController.protect, userController.createUser)
;

// router.use(authController.restrictedTo('admin'));
router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser)
;

module.exports = router;
