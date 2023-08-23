const express = require('express');

const authController = require('../controller/authcontroller');
const transactionController = require('../controller/transactionController');

const router = express.Router();

router.post('/', authController.protect, transactionController.makeTransferCreateTransaction);
router.get('/', authController.protect, transactionController.getAllTransactions);
router.get('/:id',authController.protect, transactionController.getTransaction);
router.get('/:userId', authController.protect, transactionController.getAllTransactionByUser);


router.get('/payment-verification/:reference', transactionController.verifyPaystackPayment);


module.exports = router;