const express = require('express');
const orderController = require('../controller/orderController');
// const authController = require('../controller/authController');

const router = express.Router();


// router.get('/all-orders', authController.protect, orderController.getAllOrders);

// router.get('/:id', authController.protect, orderController.getOrder);

router.patch('/completed-order/:orderId', orderController.recievedOrder);

// router.get('/payment-verification/:reference', authController.protect, orderController.verifyPaystackPayment);


module.exports = router;