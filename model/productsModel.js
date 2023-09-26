const crypto = require('crypto');

const mongoose = require('mongoose');
const slugify = require('slugify');


const productSchema = new mongoose.Schema({
    vendor: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true,
        lowercase: true
    },
    image: {
        type: String,
        default: 'product-default.png'
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price'],
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A product must have a description'],
        maxLength: [5000, "Description must not be more than 5000 characters"],
        minLength: [500, "Description must not be more than 500 characters"],
    },
    summary: {
        type: String,
        required: [true, 'A product must have a summary'],
        trim: true,
        maxLength: [200, "Summary must not be more than 200 characters"],
    },
    niche: {
        type: String,
        required: [true, 'A product must have a niche'],
    },
    commissionPercentage: {
        type: Number,
        required: [true, 'A product must have a Commission percentage'],
        minLength: [10, "Commission percent must not be less than 10%"]
    },
    commissionAmount: {
        type: Number,
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
    approval: {
        type: String,
        enum: ['approved', 'pending', 'decined'],
        default: 'pending'
    },
    recurringCommission: {
        type: Boolean,
        default: false,
    },
    productVideoLink: String,
    primaryLocation: String,
    primaryGender: String,
    // primaryLocation: [String],
    // primaryGender: [String],
    primaryAgeRange: [String],
    secondaryLoaction: [String],
    secondaryAgeRange: [String],
    secondaryGender: [String],
    socialMeadialPlaces: [String],
    contactEmail: String,
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
    if(typeof this.niche === 'string') {
        this.category = slugify(this.niche, { lower: true });
    }
    next();
});

productSchema.pre('save', function(next) {
    const commission = (this.commissionPercentage / 100) * this.price;
    this.commissionAmount = Math.trunc(commission);
    next();
})

productSchema.pre('save',function(next) {
    if(typeof this.recurringCommission === 'string') {
        this.recurringCommission = this.recurringCommission === 'true'
    }
    next();
});

productSchema.pre('save', function (next) {
    this.price = parseFloat(this.price);
    this.commissionPercentage = parseFloat(this.commissionPercentage);
    next();
  });

productSchema.pre(/^find/, function (next) {
    this.sort({ isBoosted: -1 }); // Sort by isBoosted field in descending order
    next();
});


productSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'vendor',
        select: 'slug _id image username businessName email active pendingAmountWallet totalAmountWallet'
    });
    next();
});

productSchema.pre(/^find/, function(next) {
    this.find({ 'vendor.active': { $ne: false } })
    next();
});

// productSchema.pre('save', function (next) {
//     if (typeof this.price !== 'number') return '';
//     const formattedPrice = this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     this.price = formattedPrice ;
//     next();
// });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;