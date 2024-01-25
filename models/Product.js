import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const ProductSchema = new mongoose.Schema(
	{
		sku: { type: String },
		title: { type: String, trim: true, required: true, index: true },
		slug: { type: String, slug: 'title', unique: true },
		brand: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Brand',
		},
		condition: { type: String, default: 'new' },
		buyPrice: { type: Number, trim: true, default: 0 },
		sellPrice: { type: Number, trim: true, default: 0 },
		resellerPrice: { type: Number, trim: true, default: 0 },
		isQuantityPreset: { type: Boolean, default: false },
		quantityPresets: [
			{
				min: { type: Number, default: 0 },
				max: { type: Number, default: 0 },
				price: { type: Number, default: 0 },
				resellerPrice: { type: Number, default: 0 },
				index: { type: String },
			},
		],
		images: [
			{
				name: { type: String, required: true },
				url: { type: String, required: true },
			},
		],
		countInStock: { type: Number, trim: true, default: 0 },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		tags: [{ type: String, trim: true }],
		description: { type: String, trim: true },
		shippingAndReturns: {
			name: { type: String },
			url: { type: String },
			fileKey: { type: Number },
		},
		instructions: {
			name: { type: String },
			url: { type: String },
			fileKey: { type: Number },
		},
		warranty: {
			name: { type: String },
			url: { type: String },
			fileKey: { type: Number },
		},
		faqs: [
			{
				question: { type: String, trim: true },
				answer: { type: String, trim: true },
				index: { type: String },
			},
		],
		unitsSold: { type: Number, default: 0 },
		rating: { type: Number, trim: true, default: 0 },
		onSale: { type: Boolean, default: false },
		featured: { type: Boolean, default: false },
		discount: { type: Number, trim: true, default: 0 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

export default mongoose.models.Product ||
	mongoose.model('Product', ProductSchema)
