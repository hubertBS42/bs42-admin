import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const OrderSchema = new mongoose.Schema(
	{
		customerInfo: {
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			phone: { type: String },
		},
		status: { type: String, default: 'pending' }, //pending, processing, shipped
		rate: { type: Number },
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
				quantity: { type: Number, default: 1 },
				price: { type: Number },
			},
		],
		totalPrice: { type: Number },
		shippingInfo: {
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			phone: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			digitalAddress: { type: String },
		},
		paymentStatus: { type: String, default: 'pending' }, //pending, paid
		paymentMethod: { type: String },
		shippingMethod: { type: String },
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
