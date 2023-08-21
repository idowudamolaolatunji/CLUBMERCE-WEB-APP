const crypto = require('crypto');

const mongoose = require('mongoose');
const slugify = require('slugify');


const productSchema = new mongoose.Schema({
    vendor: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        // required: [true, 'A product must have a vendor']
    },
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true
    },
    brandLogo: String,
    image: {
        type: String,
        required: [true, 'A product must have an image'],
        detault: 'product-default.png'
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
    niche: {
        type: String,
        trim: true,
        // required: [true, 'A product must have a niche'],
    },
    commissionPercentage: {
        type: Number,
        required: [true, 'A product must have a Commission percentage'],
    },
    commissionAmount: {
        type: Number,
        required: [true, 'A product must have a Commission Amount'],
    },
    type: {
        type: String,
        enum: ['Digital', 'Physical'],
        default: 'Physical'
    },
    affiliateTools: Boolean,
    slug: String,
    category: String,
    subImages: [String],
    banners: [String],
    clicks: {
        type: Number,
        default: 0,
    },
    purchasesCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    productGravity: {
        type: Number,
        default: 0
    },
    profits: {
        type: Number,
        default: 0
    },
    isBoosted: {
        type: Boolean,
        default: false,
    },
    // isBoosted
    recurringCommission: {
        type: Boolean,
        default: false,
    },
    primaryLocation: [String],
    secondaryLoaction: [String],
    primaryAgeRange: [String],
    secondaryAgeRange: [String],
    primaryGender: [String],
    secondaryGender: [String],
    socialMeadialPlaces: [String],
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

productSchema.pre('save', function(next) {
    this.category = slugify(this.niche, { lower: true });
    next();
});

productSchema.pre(/^find/, function (next) {
    this.sort({ isBoosted: -1 }); // Sort by isBoosted field in descending order
    next();
});

productSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'vendor',
        select: 'fullName slug _id businessName email active'
    });
    next();
});

productSchema.pre(/^find/, function(next) {
    this.find({ 'vendor.active': { $ne: false } })
    next();
});

productSchema.pre('save', function (next) {
    if (typeof this.price !== 'number') return '';
    const formattedPrice = this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.price = formattedPrice ;
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;