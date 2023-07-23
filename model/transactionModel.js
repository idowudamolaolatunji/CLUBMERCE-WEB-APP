const mongoose = require('mongoose');
const moment = require('moment');

const transactionSchema = new mongoose.Schema({
    transactionId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    purpose: {
        type: String,
        default: 'withdrawal'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

transactionSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '_id fullName'
    })
    next();
});

transactionSchema.virtual('formattedCreatedAt').get(function () {
    // return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
    return moment(this.createdAt).format('YYYY-MM-DD');
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;