import mongoose from 'mongoose'

const StockLevelSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		location: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Location',
		},
		storage: { type: String },
		sku: { type: String },
		count: { type: Number, default: 0 },
		min: { type: Number, default: 0 },
	},
	{ timestamps: true }
)

const StockLevel =
	mongoose.models.StockLevel ||
	mongoose.model('StockLevel', StockLevelSchema)

export default StockLevel
