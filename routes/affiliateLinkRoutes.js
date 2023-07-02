const express = require('express');
const affiliateLinkController = require('../controller/affiliateLinkController');
const authController = require('../controller/authcontroller');

const router = express.Router();


router.push('/:productSlug', authController.restrictedTo('affiliate'), affiliateLinkController.createAffiliateLink);


