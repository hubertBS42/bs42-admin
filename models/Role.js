import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const RoleSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true, unique: true },
		slug: { type: String, slug: 'title' },
		description: { type: String },
		permissions: [
			{
				resource: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Resource',
				},
				actions: [{ type: String }],
			},
		],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

export default mongoose.models.Role ||
	mongoose.model('Role', RoleSchema)
