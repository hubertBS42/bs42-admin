import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const ResourceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		slug: { type: String, slug: 'name' },
		description: {
			type: String,
		},
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

export default mongoose.models.Resource ||
	mongoose.model('Resource', ResourceSchema)
