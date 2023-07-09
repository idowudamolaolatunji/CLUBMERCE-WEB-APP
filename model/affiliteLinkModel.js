const mongoose = require('mongoose');

const affiliateLinkSchema = new mongoose.Schema({
  user: { type: String, ref: 'User' },
  product: { type: String, ref: 'Product' },
  link: String,
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
});

const AffiliateLink = mongoose.model('AffiliateLink', affiliateLinkSchema);
module.exports = AffiliateLink;

