const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  createdAt: { type: Date, default: Date.now, required: true },
  expiringDate: Date,
});

userLogSchema.pre('save', function (next) {
    // Calculate the expiry date by adding 30 days to the created date
    const expiryDate = new Date(this.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30);
    this.expiringDate = expiryDate;
  
    next();
  });

userLogSchema.methods.isExpired = function () {
  return this.expiringDate > this.createdAt;
};

const UserLog = mongoose.model('UserLog', userLogSchema);
module.exports = UserLog;
