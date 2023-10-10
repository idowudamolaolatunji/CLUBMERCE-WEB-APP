const mongoose = require('mongoose');
const moment = require('moment');

const withdrawalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: String, required: true },
    status: {
        type: String,
        enum: ['success', 'pending', 'failed'],
        default: 'pending'
    },
    bankName: String,
    bankAccountNumber: String,
    bankHoldersName: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

withdrawalSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '_id role fullName businessName'
    })
    next();
});

withdrawalSchema.virtual('formattedCreatedAt').get(function () {
    return moment(this.createdAt).format('YYYY-MM-DD');
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
module.exports = Withdrawal;