import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
	{
		orderNumber: { type: String, required: true, unique: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		contact: {
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			phone: { type: String },
		},
		billing: {
			firstName: { type: String },
			lastName: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			digitalAddress: { type: String },
		},
		shipping: {
			firstName: { type: String },
			lastName: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			digitalAddress: { type: String },
			method: { type: String },
			cost: { type: Number, default: 0 },
			status: { type: String, default: 'pending' },
		},
		invoice: {
			number: { type: String },
			date: { type: Date },
			dueDate: { type: Date },
		},
		status: { type: String, default: 'placed' }, //placed, pending, confirmed, rejected, ready/shipped, delivering, pickedUp/delivered
		rate: { type: Number },
		discount: {
			percentage: { type: Number, default: 0 },
			reason: { type: String, default: null },
		},
		products: [
			{
				productRef: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
				title: { type: String },
				brand: {
					name: { type: String },
				},
				category: {
					type: [String],
				},
				images: [{ name: { type: String }, url: { type: String } }],
				quantity: { type: Number, default: 1 },
				price: { type: Number },
			},
		],
		total: { type: Number },
		subtotal: { type: Number },
		payment: {
			method: { type: String },
			status: { type: String, default: 'pending' },
		},
		trackingInfo: {
			carrier: { type: String },
			trackingNumber: { type: String },
		},
		coupons: [
			{
				code: { type: String },
				amount: { type: Number },
			},
		],
		notes: { type: String },
		returnInfo: {
			requested: { type: Boolean, default: false },
			reason: { type: String },
			status: { type: String },
		},
		customerFeedback: {
			rating: { type: Number },
			comment: { type: String },
		},
	},
	{ timestamps: true }
)

export default mongoose.models.Order ||
	mongoose.model('Order', OrderSchema)
