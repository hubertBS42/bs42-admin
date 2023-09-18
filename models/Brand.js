import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const BrandSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, index: true, unique: true },
		slug: { type: String, slug: 'name' },
		website: { type: String },
		logo: {
			name: { type: String },
			url: { type: String },
		},
		description: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

export default mongoose.models.Brand ||
	mongoose.model('Brand', BrandSchema)
