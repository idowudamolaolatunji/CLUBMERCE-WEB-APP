const express = require('express')
const multer = require('multer');

const authController = require("../controller/authcontroller");
const userController = require("../controller/usersController");

const upload = multer({ dest: 'public/asset/img/user' })
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-email/:token", authController.verifyEmail);
router.post('/logout', authController.logout)
;
router.post("/login", authController.login);
router.post("/login-admin", authController.loginAdmin);
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)

router.get("/getMe", authController.protect, userController.getMe);
router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch("/updateMyBank", authController.protect, userController.updateBankDetails);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.patch("/deleteAccount", authController.protect, userController.deleteAccount);

// router.patch('/updateMe', authController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);

 
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
