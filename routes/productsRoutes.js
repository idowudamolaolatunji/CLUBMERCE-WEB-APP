const express = require("express");
const authController = require('./../controller/authcontroller')
const productsController = require("../controller/productsController");

const router = express.Router();
router.route("/")
  .get(productsController.getAllProduct)
  .post(authController.protect, authController.restrictedTo('vendor', 'admin'), productsController.createProduct);
  
router.route("/:id")
  .get(productsController.getProduct)
  .get(authController.protect, productsController.getProduct)
  .patch(authController.protect, authController.restrictedTo('vendor', 'admin'), productsController.updateProduct)
  .delete(authController.protect, authController.restrictedTo('vendor', 'admin'), productsController.getProduct);

module.exports = router;
