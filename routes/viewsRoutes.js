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
router.get('/affiliate-dashboard', authController.isLoggedIn, viewController.affiliateDashboard);
router.get('/marketplace', authController.isLoggedIn, viewController.marketPlace);
router.get('/marketplace/:slug', authController.isLoggedIn, viewController.product);
router.get('/affiliate-performance', authController.isLoggedIn, viewController.affiliatePerformance);
router.get('/affiliate-transaction', authController.isLoggedIn, viewController.affiliateTransaction);

// common routes
router.get('/settings', authController.isLoggedIn, viewController.settings);
router.get('/profile', authController.isLoggedIn, viewController.profile);
router.get('/notification', authController.isLoggedIn, viewController.notification);

// vendors
router.get('/vendor-dashboard', authController.isLoggedIn, viewController.vendorDashboard);
router.get('/product-catalog', authController.isLoggedIn, viewController.productCatalog);
router.get('/vendor-performance', authController.isLoggedIn, viewController.vendorPerformance);
router.get('/vendor-transaction', authController.isLoggedIn, viewController.vendorTransaction);

// admin
router.get('/clubmerce-admin-auth', authController.isLoggedIn, viewController.adminAuth);
router.get('/all-performance', authController.isLoggedIn, viewController.allPerformance);
router.get('/product-marketplace', authController.isLoggedIn, viewController.productMarketplace);
router.get('/admin-settings', authController.isLoggedIn, viewController.adminSettings);
router.get('/manage-users', authController.isLoggedIn, viewController.manageUsers);
router.get('/manage-products', authController.isLoggedIn, viewController.manageProducts);
router.get('/manage-payment', authController.isLoggedIn, viewController.managePayment);


module.exports = router;