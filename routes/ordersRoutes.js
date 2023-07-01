const express = require('express');
const orderController = require('../controller/orderController');

const router = express.Router();


router.route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrders);

    router.route("/:id")
    .get(orderController.getOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);

module.exports = router;