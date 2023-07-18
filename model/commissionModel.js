const mongoose =  require('mongoose');

const commissionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    affiliate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commissionAmount: Number,
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Commissions = mongoose.model('Commissions', commissionSchema);
module.exports = Commissions;



