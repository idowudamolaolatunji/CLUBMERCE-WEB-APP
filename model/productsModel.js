const crypto = require('crypto');

const mongoose = require('mongoose');
const slugify = require('slugify');


const productSchema = new mongoose.Schema({
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
    type: Boolean,
    affiliateTools: Boolean,
    productGravity: {
        type: Number,
        default: 1
    },
    subImages: [String],
    banners: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function(next) {
    const slug = slugify(this.name, { lower: true });
    // const randomId = crypto.randomInt(100000, 999999).toString();
    this.slug = `${slug}-${this._id}`;
    // we would need to concatinate the slug with the random id or product id to make every product slug unique, using the concat method and join the together with a '-'
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;