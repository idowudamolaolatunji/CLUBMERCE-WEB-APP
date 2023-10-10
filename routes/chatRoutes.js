const express = require('express');
const authController = require('../../controller/authController');
const authController = require("../controller/authcontroller");


const router = express.Router();
// router.route('/send-message/:recipientSlug').post(authController.protect, chatController.sendMessage);
// router.route('/:recieverId').post(authController.protect, chatController.sendMessage);
router.route('/send-message').post(authController.protect, chatController.sendMessage);

module.exports = router;