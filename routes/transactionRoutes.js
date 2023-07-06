const express = require('express');

const transactionController = require('../controller/transactionController');

const router = express.Router();

router.post('/transaction/transfer', transactionController.makeTransferCreateTransaction);
router.get('/transaction/:userId', transactionController.getTransaction);
router.get('/transactions', transactionController.getAllTransactions);

module.exports = router;