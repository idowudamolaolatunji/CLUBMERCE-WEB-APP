const mongoose = require("mongoose");
const validator = require('validator')

const orderSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.ObjectId,
		ref: "Product",
	},
	vendor: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	affiliate: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	buyer: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	orderStatus: {
        type: String,
		enum: ['pending', 'delivered'],
        default: 'pending',
    },
	isDelevered: {
		type: Boolean,
		default: false
	},
	quantity: {
		type: Number,
		default: 1,
	},
	amount: String,
	vendorProfit: Number,
	affiliateCommission: Number,
	email: {
		type: String,
		required: [true, `Please provide us a reciever email address`],
		trim: true,
		lowercase: true,
		validate: [validator.isEmail, "Ënter a valid email"] 
	},
	fullname: {
		type: String,
		required: [true, `Please provide a reciever's fullname`],
	},
	country: String,
	// state: String,
	// city: String,
	// postalCode: String,
	// address: String,
	reference: {
		type: String,
		required: true
	},
	orderedAt: String,
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

orderSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'vendor',
		select: '_id businessName',
	}).populate({
		path: 'affiliate',
		select: '_id email'
	}).populate({
		path: 'buyer',
		select: '_id email country state phone name'
	}).populate({
		path: 'product',
		select: '_id name image slug niche category type'
	})
	next();
})

orderSchema.virtual('formattedCreatedAt').get(function () {
    // return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
    return moment(this.createdAt).format('YYYY-MM-DD');
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;