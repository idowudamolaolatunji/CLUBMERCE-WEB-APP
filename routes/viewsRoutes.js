const express = require('express');

const viewController = require('../controller/viewsController')
const authController = require('../controller/authcontroller')
const router = express.Router();

//////////////////////////////////////////////
router.get('/', viewController.home);
router.get('/get-started', viewController.getStarted);
router.get('/vendor', viewController.vendor);
router.get('/affiliate', viewController.affiliate);
router.get('/login', viewController.login);
router.get('/signup', viewController.signUp);
router.get('/affiliate_dashboard', authController.isLoggedIn, viewController.affiliateDashboard);
router.get('/marketplace', authController.isLoggedIn, viewController.marketPlace);
router.get('/performance', authController.isLoggedIn, viewController.reportPerformance);
router.get('/product/:slug', authController.isLoggedIn, viewController.product);
router.get('/profile', authController.isLoggedIn, viewController.profile);
router.get('/transaction', authController.isLoggedIn, viewController.transaction);
router.get('/settings', authController.isLoggedIn, viewController.settings);
router.get('/notification', authController.isLoggedIn, viewController.notification);
router.get('/vendor_dashboard', authController.isLoggedIn, viewController.vendorDashboard);

module.exports = router;