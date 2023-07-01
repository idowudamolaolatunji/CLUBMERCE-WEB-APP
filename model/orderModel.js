const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
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

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;