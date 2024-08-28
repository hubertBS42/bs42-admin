import mongoose from 'mongoose'

const InventorySchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		location: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Location',
		},
		sku: { type: String },
		count: { type: Number, trim: true, default: 0 },
		unitsSold: { type: Number, default: 0 },
		min: { type: Number, default: 0 },
		max: { type: Number, default: 0 },
	},
	{ timestamps: true }
)

const Inventory =
	mongoose.models.Inventory ||
	mongoose.model('Inventory', InventorySchema)

export default Inventory
