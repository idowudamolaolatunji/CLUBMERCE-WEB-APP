const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    purpose: {
        type: String,
        enum: ['order', 'withdrawal'],
        default: 'order'
    }
});

transactionSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: ''
    })
    next();
})

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;