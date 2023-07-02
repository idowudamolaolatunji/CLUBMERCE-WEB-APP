const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "product",
			required: true,
		},
		quantity: {
			type: Number,
			default: 1,
		},
		createdAt: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "marketer",
			required: true,
		},
	},
	{ strictQuery: true, timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;