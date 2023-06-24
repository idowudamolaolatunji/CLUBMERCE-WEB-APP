const express = require('express');

const viewController = require('../controller/viewsController')
const router = express.Router();

//////////////////////////////////////////////
router.get('/', viewController.home);
router.get('/get-started', viewController.getStarted);
router.get('/vendor', viewController.vendor);
router.get('/affiliate', viewController.affiliate);
router.get('/login', viewController.login);
router.get('/signup', viewController.signUp);
router.get('/affiliate_dashboard', viewController.affiliateDashboard);
router.get('/marketplace', viewController.marketPlace);
router.get('/performance', viewController.reportPerformance);
router.get('/product', viewController.product);
router.get('/profile', viewController.profile);
router.get('/transaction', viewController.transaction);
router.get('/settings', viewController.settings);
router.get('/notification', viewController.notification);
router.get('/vendor_dashboard', viewController.vendorDashboard);

module.exports = router;