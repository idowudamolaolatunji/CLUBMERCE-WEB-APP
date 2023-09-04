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
    paidAt: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

// commissionSchema.virtual('formattedCreatedAt').get(function () {
//     return moment(this.createdAt).format('YYYY-MM-DD');
// });

commissionSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'affiliate',
		select: '_id email'
	}).populate({
		path: 'product',
		select: '_id name image slug niche category'
	})
	next();
})


const Commissions = mongoose.model('Commissions', commissionSchema);
module.exports = Commissions;



