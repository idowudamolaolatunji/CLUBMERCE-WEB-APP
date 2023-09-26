const express = require("express");
const authController = require('../controller/authcontroller');
const productsController = require("../controller/productsController");
// const productByVendorController = require('../controller/productByVendorController');

const router = express.Router();

router.route('/top-20-best',)
  .get(authController.protect, productsController.aliasTopProduct, productsController.getAllProduct)
    
router.route("/")
.get(authController.protect, productsController.getAllProduct)
.post(authController.protect, productsController.createProduct)
router.patch('/uploadProductImage/:id' , authController.protect, productsController.uploadProductImage, productsController.createProductImages)
// router.patch('/uploadProductImage/:id' , authController.protect, productsController.uploadProductImage, productsController.resizeProductImage, productsController.createProductImages)
// router.patch('/uploadProductImage/:id' , authController.protect, productsController.createProductImages)

router.route('/vendor-product')
  .get(authController.protect, productsController.getProductsByVendor)

router.route("/:id")
.get(authController.protect, productsController.getProduct)
.patch(authController.protect, productsController.updateProduct)
// .patch(authController.protect, productsController.uploadProductImage, productsController.resizeProductImage, productsController.updateProductImages)

.delete(productsController.deleteProduct);

router.route('/search-product').post(authController.protect, productsController.searchProduct);
router.route('/niche/:category').get(productsController.getProductByCategory);
router.route('/category/:option').get(authController.protect, productsController.getProductsByOption);


module.exports = router;
