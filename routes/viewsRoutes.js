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


// buyers
router.get('/buyers/login', viewController.buyerLoginAuth)
router.get('/buyers/signup', viewController.buyerSignupAuth)
router.get('/buyers/order-product/pay', authController.isLoggedIn, viewController.paymentForm);
router.get('/order-product/:username/:productSlug', authController.isLoggedIn, viewController.getOrderPage);


// affiliates
router.get('/marketplace', authController.isLoggedIn, viewController.marketPlace);
router.get('/marketplace/:slug', authController.isLoggedIn, viewController.getProduct);
router.get('/leaderboard', authController.protect, viewController.leaderboard);

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
router.get('/manage-order', authController.isLoggedIn, viewController.manageOrders);
router.get('/manage-users', authController.isLoggedIn, viewController.manageUsers);
router.get('/manage-products', authController.isLoggedIn, viewController.manageProducts);
router.get('/manage-payment', authController.isLoggedIn, viewController.managePayments);



module.exports = router;