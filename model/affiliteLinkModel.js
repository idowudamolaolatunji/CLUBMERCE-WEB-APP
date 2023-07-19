const mongoose = require('mongoose');

const affiliateLinkSchema = new mongoose.Schema({
  affiliate: { type: mongoose.Schema.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
  link: String,
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
});

// affiliateLinkSchema.pre(/^find/, function(next) {
//   this.polute({
//     path: 'affiliate',
//     select: ''
//   }).polute({
//     path: 'product',
//     select: ''
//   })
//   next();
// })

const AffiliateLink = mongoose.model('AffiliateLink', affiliateLinkSchema);
module.exports = AffiliateLink;

