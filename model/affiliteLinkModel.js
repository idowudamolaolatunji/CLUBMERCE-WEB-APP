const mongoose = require('mongoose');

const affiliateLinkSchema = new mongoose.Schema({
  affiliate: { type: mongoose.Schema.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
  link: String,
  clicks: { type: Number, default: 0 },
  commission: {
      type: Number,
      default: 0
  },
  purchases: {
      type: Number,
      default: 0
  },
  createdAt: { type: Date, default: Date.now },
});

affiliateLinkSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'affiliate',
    select: '_id fullName'
  }).populate({
    path: 'product',
    select: '_id name image'
  })
  next();
})

const AffiliateLink = mongoose.model('AffiliateLink', affiliateLinkSchema);
module.exports = AffiliateLink;

