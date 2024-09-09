import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const CategorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true, index: true },
		slug: { type: String, slug: 'name', unique: true },
		description: { type: String },
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			default: null,
			autopopulate: { select: 'name parent' },
		},
		images: [
			{
				name: { type: String, required: true },
				url: { type: String, required: true },
			},
		],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

CategorySchema.plugin(require('mongoose-autopopulate'))

// CategorySchema.virtual('products', {
// 	ref: 'Product',
// 	localField: '_id',
// 	foreignField: 'category',
// })

export default mongoose.models?.Category ||
	mongoose.model('Category', CategorySchema)
