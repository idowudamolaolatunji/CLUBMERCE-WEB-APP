const express = require('express')
const userController = require("../controller/usersController");
const authController = require("../controller/authcontroller");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get('/logout', authController.logout);
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)

router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch("/updateMe", authController.protect, userController.getMe, userController.updateMe);
router.patch("/deleteAccount", authController.protect, userController.deleteAccount);

router.patch('/updateMe', authController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
//////////////////////
 
// router.use(authController.restrictedTo('admin'));
router
  .route('/')
  .get(authController.protect, userController.getAllUser)
  .post(authController.protect, userController.createUser);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;
