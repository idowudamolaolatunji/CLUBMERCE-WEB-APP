const express = require('express')
const userController = require("../controller/usersController");
const authController = require("../controller/authcontroller");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
// router.post("/forgotPassword", authController.forgotPassword)
// router.patch("/resetPassword", authController.resetPassword)
// router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.patch("/deleteAccount", authController.protect, userController.deleteAccount);


router.route("/").get(userController.getAllUser);
router.route("/:id").get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
