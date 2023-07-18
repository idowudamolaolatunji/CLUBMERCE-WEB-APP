const mongoose = require('mongoose');

const affiliateLinkSchema = new mongoose.Schema({
  affiliate: { type: mongoose.Schema.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
  link: String,
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
});

const AffiliateLink = mongoose.model('AffiliateLink', affiliateLinkSchema);
module.exports = AffiliateLink;

