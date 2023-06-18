const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        // unique: true,
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
        // maxLength: [4000, "Description must not be more than 4000 characters"],
        // minLength: [500, "Description must not be more than 800 characters"],
    },
    summary: {
        type: String,
        required: [true, 'A product must have a summary'],
        trim: true,
        maxLength: [120, "Summary must not be more than 200 characters"],
        minLength: [60, "Summary must not be more than 60 characters"],
    },
    productPercentage: {
        type: Number,
        required: [true, 'A product must have a price'],
    },
    productType: [String],
    productNiche: [String],
    affiliateTools: [String],
    uniqueUrl: [String],
    productGravity: {
        type: Number,
        default: 1
    },
    subImages: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;