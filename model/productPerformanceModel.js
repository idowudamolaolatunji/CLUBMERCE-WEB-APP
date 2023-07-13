const mongoose = require('mongoose');


const productPerformanceSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Product'
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
    affiliates: {
        type: Number,
        default: 0
    },
});


const ProductPerformance = mongoose.model('ProductPerformance', productPerformanceSchema);
module.exports = ProductPerformance;