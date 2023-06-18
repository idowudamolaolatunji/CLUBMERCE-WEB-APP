const express = require('express')
const userController = require("../controller/usersController");
const authController = require("../controller/authcontroller");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword", authController.forgotPassword)
router.patch("/updateMyPassword", authController.protect, authController.updatePassword);


router.route("/").get(userController.getAllUser);
router.route("/:id").get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
