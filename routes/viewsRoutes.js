const express = require('express');

const viewController = require('../controller/viewsController')
const authController = require('../controller/authcontroller')
const router = express.Router();

//////////////////////////////////////////////
// general routes
router.get('/', viewController.home);
router.get('/get-started', viewController.getStarted);
router.get('/vendor', viewController.vendor);
router.get('/affiliate', viewController.affiliate);
router.get('/login', viewController.login);
router.get('/signup', viewController.signUp);

// affiliates
router.get('/marketplace', authController.protect, viewController.marketPlace);
router.get('/marketplace/:slug', authController.protect, viewController.getProduct);

// vendors
router.get('/product-catalog', authController.protect, viewController.productCatalog);

// common routes
router.get('/dashboard', authController.protect, viewController.dashboard);
router.get('/settings', authController.isLoggedIn, viewController.settings);
router.get('/profile', authController.isLoggedIn, viewController.profile);
router.get('/performance', authController.isLoggedIn, viewController.performance);
router.get('/transaction', authController.isLoggedIn, viewController.transaction);

// admin
router.get('/admin-auth-login', viewController.adminAuth);
// router.get('/product-marketplace', authController.isLoggedIn, viewController.productMarketplace);
router.get('/manage-users', authController.isLoggedIn, viewController.manageUsers);
router.get('/manage-products', authController.isLoggedIn, viewController.manageProducts);
router.get('/manage-payment', authController.isLoggedIn, viewController.managePayments);
router.get('/manage-order', authController.isLoggedIn, viewController.manageOrders);

// visitors
router.get('/pay', viewController.paymentForm);
router.get('/order-product/:username/:productSlug', viewController.getOrderProductPage);


module.exports = router;