const express = require("express");
const authController = require('./../controller/authcontroller')
const productsController = require("../controller/productsController");

const router = express.Router();
router.route("/")
  .get(authController.protect, productsController.getAllProduct)
  .post(authController.protect, authController.restrictedTo, productsController.createProduct);
router
  .route("/:id")
  .get(authController.protect, productsController.getProduct)
  .patch(authController.protect, authController.restrictedTo, productsController.updateProduct)
  .delete(authController.protect, authController.restrictedTo, productsController.deleteProduct);

module.exports = router;
