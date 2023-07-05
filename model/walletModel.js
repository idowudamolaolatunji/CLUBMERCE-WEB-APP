const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    recieverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    amount: Number,
    referenceString: String,
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;