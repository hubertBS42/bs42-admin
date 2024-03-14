import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
	{
		customerInfo: {
			userRef: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			phone: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			digitalAddress: { type: String },
		},
		orderNumber: { type: String, required: true, unique: true },
		invoice: {
			number: { type: String, required: true, unique: true },
			date: { type: Date, default: Date.now },
		},
		status: { type: String, default: 'pending' }, //pending, processing, shipped
		rate: { type: Number },
		products: [
			{
				productRef: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
				title: { type: String },
				brand: {
					name: { type: String },
					website: { type: String },
					url: { type: String },
				},
				category: {
					type: [String],
				},
				images: [{ name: { type: String }, url: { type: String } }],
				quantity: { type: Number, default: 1 },
				price: { type: Number },
			},
		],
		totalPrice: { type: Number },
		shipping: {
			address: {
				firstName: { type: String },
				lastName: { type: String },
				email: { type: String },
				phone: { type: String },
				region: { type: String },
				town: { type: String },
				address: { type: String },
				digitalAddress: { type: String },
			},
			method: { type: String },
			status: { type: String, default: 'pending' },
		},
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
