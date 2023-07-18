const mongoose = require('mongoose');


const productPerformanceSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Product'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    },
    orders: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    },
    profits: {
        type: Number,
        default: 0
    },
    affiliateGravity: {
        type: Number,
        default: 0
    },
});


const ProductPerformance = mongoose.model('ProductPerformance', productPerformanceSchema);
module.exports = ProductPerformance;