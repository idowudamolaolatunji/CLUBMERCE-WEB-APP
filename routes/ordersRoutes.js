const express = require('express');
const orderController = require('../controller/orderController');

const router = express.Router();

router.get('/all-orders', orderController.getAllOrders)
router.post('/order-now', orderController.OrdersAndPayment);

router.route("/:id")
   .get(orderController.getOrder)

module.exports = router;