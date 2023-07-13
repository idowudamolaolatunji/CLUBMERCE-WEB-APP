const mongoose = require('mongoose');


const userPerformanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Product'
    },
    commission: {
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
    links: {
        type: Number,
        default: 0
    },
    createdAT: {
        type: Date,
        default: Date.now()
    }
});


const UserPerformance = mongoose.model('UserPerformance', userPerformanceSchema);
module.exports = UserPerformance;