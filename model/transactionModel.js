const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    bankAccount: String,
    description: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;