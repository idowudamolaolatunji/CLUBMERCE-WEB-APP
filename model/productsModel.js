const crypto = require('crypto');

const mongoose = require('mongoose');
const slugify = require('slugify');


const productSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'A product must have an image']
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price'],
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A product must have a description'],
        maxLength: [4000, "Description must not be more than 4000 characters"],
        minLength: [500, "Description must not be more than 800 characters"],
    },
    summary: {
        type: String,
        required: [true, 'A product must have a summary'],
        trim: true,
        maxLength: [130, "Summary must not be more than 200 characters"],
        minLength: [80, "Summary must not be more than 60 characters"],
    },
    category: {
        type: String,
        required: [true, 'A product must have a Category'],
    },
    commission: {
        type: String,
        required: [true, 'A product must have a Commission percentage'],
    },
    
    type: String,
    affiliateTools: Boolean,
    
    slug: String,
    subImages: [String],
    banners: [String],
    clicks: {
        type: Number,
        default: 0,
    },
    purchasesCount: { type: Number, default: 0 },
    productGravity: {
        // type: mongoose.Schema.Types.ObjectId, ref: 'User',
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});


// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function(next) {
    const slug = slugify(this.name, { lower: true });
    this.slug = `${slug}-${this._id}`;
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;