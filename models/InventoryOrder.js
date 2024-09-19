import Supplier from './Supplier'
import User from './User'
import Product from './Product'
import Brand from './Brand'
import mongoose from 'mongoose'

const InventoryOrderSchema = new mongoose.Schema(
	{
		orderNumber: { type: String, required: true, unique: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		supplier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Supplier',
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
				buyPrice: { type: Number },
			},
		],
		files: [
			{
				name: { type: String },
				originalName: { type: String },
				url: { type: String },
			},
		],
		shippingCost: { type: Number },
		subtotal: { type: Number },
		total: { type: Number },
		status: [
			{
				type: { type: String }, //created, processing, delivering, delivered, cancelled
				timestamp: { type: Date },
			},
		],
	},
	{ timestamps: true }
)

InventoryOrderSchema.pre('save', async function (next) {
	const order = this

	if (order.isModified('status')) {
	}

	next()
})

export default mongoose.models.InventoryOrder ||
	mongoose.model('InventoryOrder', InventoryOrderSchema)
