import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const BlogSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, slug: 'title' },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		previewImage: {
			name: { type: String },
			url: { type: String },
		},
		bannerImage: {
			name: { type: String },
			url: { type: String },
		},
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

export default mongoose.models.Blog ||
	mongoose.model('Blog', BlogSchema)
