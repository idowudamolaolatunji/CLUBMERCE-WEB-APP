const express = require('express');
const affiliateLinkController = require('../controller/affiliateLinkController');
const authController = require('../controller/authcontroller');

const router = express.Router();


router.route('/:productSlug',)
    // .post( authController.restrictedTo('affiliate'), affiliateLinkController.createAffiliateLink);
    .post(affiliateLinkController.createAffiliateLink);
