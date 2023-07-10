const mongoose = require("mongoose");
const validator = require('validator')

const orderSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
	},
	vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	orderStaus: {
        type: String,
		enum: ['pending', 'delivered'],
        default: 'pending',
    },
	quantity: {
		type: Number,
		default: 1,
	},
	price: Number,
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
	state: String,
	city: String,
	postalCode: String,
	address: String,
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;