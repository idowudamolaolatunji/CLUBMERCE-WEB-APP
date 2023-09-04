const express = require('express');
const orderController = require('../controller/orderController');

const router = express.Router();


router.get('/all-orders', orderController.getAllOrders);

router.route("/:id")
   .get(orderController.getOrder)

router.get('/payment-verification/:reference', orderController.verifyPaystackPayment);


module.exports = router;