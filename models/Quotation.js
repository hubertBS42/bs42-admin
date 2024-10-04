import mongoose from 'mongoose'

const QuotationSchema = new mongoose.Schema(
	{
		quotationNumber: { type: String, required: true, unique: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		contact: {
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			phone: { type: String },
			profileImg: { type: String },
		},
		billing: {
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
		},
		shipping: {
			firstName: { type: String },
			lastName: { type: String },
			phone: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			method: { type: String },
			cost: { type: Number, default: 0 },
			status: { type: String, default: 'pending' },
		},
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order',
			default: null,
		},
		rate: { type: Number },
		discount: {
			type: {
				type: String,
				enum: ['percentage', 'amount'],
				default: 'percentage',
			},
			value: { type: Number, default: 0 },
			equivalent: { type: Number, default: 0 },
			reason: { type: String },
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
		notes: { type: String },
	},
	{ timestamps: true }
)

export default mongoose.models.Quotation ||
	mongoose.model('Quotation', QuotationSchema)
