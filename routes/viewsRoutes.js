const express = require('express');

const viewController = require('../controller/viewsController')
const router = express.Router();
///////
//////////////////
router.get('/', viewController.home);
router.get('/get-started', viewController.getStarted);
router.get('/vendor', viewController.vendor);
router.get('/affiliate', viewController.affiliate);
router.get('/login', viewController.login);
router.get('/signup', viewController.signUp);
router.get('/dashboard', viewController.dashboard);
router.get('/marketplace', viewController.marketPlace);
router.get('/performance', viewController.reportPerformance);
router.get('/marketplace/product', viewController.product);
router.get('/profile', viewController.profile);
router.get('/transaction', viewController.transaction);
router.get('/settings', viewController.settings);
router.get('/notification', viewController.notification);

module.exports = router;