import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['product', 'order', 'inventory-order'],
			required: true,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'CommentSchema',
			default: null,
			autopopulate: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			autopopulate: true,
			required: true,
		},
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'InventoryOrder',
			required: true,
		},
		body: { type: String, required: true },
	},
	{ timestamps: true }
)

CommentSchema.plugin(require('mongoose-autopopulate'))

export default mongoose.models.InventoryOrderComment ||
	mongoose.model('InventoryOrderComment', CommentSchema)
