const express = require('express');
const orderController = require('../controller/orderController');
const authController = require("../controller/authcontroller");

const router = express.Router();

// router.get('/all-orders', authController.protect, orderController.getAllOrders);

router.patch('/recieved-order/:orderId',  authController.protect, orderController.recievedOrder);
router.patch('/delivered-order/:orderId',  authController.protect, orderController.deliveredOrder);
router.get('/payment-verification/:reference', orderController.verifyPaystackPayment);


module.exports = router;
