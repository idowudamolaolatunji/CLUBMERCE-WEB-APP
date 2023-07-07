const express = require('express');
const affiliateLinkController = require('../controller/affiliateLinkController');
const authController = require('../controller/authcontroller');

const router = express.Router();

// router.get('/generate-affiliate-links')
router.post('/generate-affiliate-link/:productSlug', authController.protect, affiliateLinkController.createAffiliateLink);

module.exports = router;
