const express = require("express");
const authController = require('../controller/authcontroller')
const productsController = require("../controller/productsController");
const productByVendorController = require('../controller/productByVendorController');

const router = express.Router();

router.route('/top-20-best',)
  .get(authController.protect, productsController.aliasTopProduct, productsController.getAllProduct)
  // .patch(
  //   authController.protect,
  //   // authController.restrictTo('vendor', 'admin'),
  //   productsController.uploadProductImages,
  //   productsController.resizeProductImages,
  //   productsController.updateProduct
  //   )
    
router.route("/")
.get(authController.protect, productsController.getAllProduct)
// .post(authController.restrictedTo('vendor', 'admin'), productsController.createProduct);
.post(authController.protect, productsController.createProduct)


router.route("/:id")
.get(authController.protect, productsController.getProduct)
// .get(authController.protect, productsController.getProduct)
// .get(authController.protect, productsController.getProduct)
// .patch(authController.restrictedTo('vendor', 'admin'), productsController.updateProduct)
// .delete(authController.restrictedTo('vendor', 'admin'), productsController.deleteProduct)
.patch(productsController.updateProduct)
.delete(productsController.deleteProduct);

router.route('/vendor-product')
  .get(productByVendorController.getAllProductsByVendor)
  .post(productByVendorController.createProductByVendor)
router.route('/vendor-product/:productId')
  .get(productByVendorController.getProductByVendor)
  .patch(productByVendorController.updateProductByVendor)
  .delete(productByVendorController.deleteProductByVendor)


module.exports = router;
