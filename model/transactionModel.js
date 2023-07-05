const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Wallet',
    },
    amount: {
        type: Number,
        required: true,
    },
    description: String,
    balance: Number,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;