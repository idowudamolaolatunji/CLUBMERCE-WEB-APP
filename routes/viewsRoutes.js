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
router.get('/contact-us', viewController.contactUs);
router.get('/login', viewController.login);


// buyers
router.get('/buyers/login', viewController.buyerLoginAuth)
router.get('/buyers/signup', viewController.buyerSignupAuth)
router.get('/order-product/:username/:productSlug', viewController.getOrderPage);
// router.get('/buyers/order-product/pay', authController.isLoggedIn, viewController.paymentForm);

router.get('/buyers/dashboard', authController.protect, viewController.dashboard);
router.get('/buyers/profile', authController.isLoggedIn, viewController.profile);


// affiliates
router.get('/marketplace', authController.isLoggedIn, viewController.marketPlace);
router.get('/marketplace/:slug', authController.isLoggedIn, viewController.getProduct);
router.get('/leaderboard', authController.protect, viewController.leaderboard);

// vendors
router.get('/product-catalog', authController.isLoggedIn, viewController.productCatalog);
router.get('/upgrade-account', authController.isLoggedIn, viewController.upgrade);

router.get('/vendor/signup/:type' , viewController.signupVendor);
router.get('/vendor/signup', viewController.signupVendor);

// common routes
router.get('/dashboard', authController.protect, viewController.dashboard);
router.get('/settings', authController.isLoggedIn, viewController.settings);
router.get('/profile', authController.isLoggedIn, viewController.profile);
router.get('/performance', authController.isLoggedIn, viewController.performance);
router.get('/transaction', authController.isLoggedIn, viewController.transaction);

// admin
router.get('/admin/login', viewController.adminAuth);
router.get('/manage-app', authController.isLoggedIn, viewController.manageApp);
router.get('/manage-ads', authController.isLoggedIn, viewController.manageAds);
router.get('/manage-order', authController.isLoggedIn, viewController.manageOrders);
router.get('/manage-users', authController.isLoggedIn, viewController.manageUsers);
router.get('/manage-products', authController.isLoggedIn, viewController.manageProducts);
router.get('/manage-payment', authController.isLoggedIn, viewController.managePayments);



module.exports = router;