import mongoose from 'mongoose'

const BannerSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		slides: [
			{
				title: { type: String, required: true, trim: true },
				description: { type: String, required: true, trim: true },
				image: {
					name: { type: String, required: true },
					url: { type: String, required: true },
				},
			},
		],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

export default mongoose.models.Banner ||
	mongoose.model('Banner', BannerSchema)
