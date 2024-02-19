import mongoose from 'mongoose'

const SlideSchema = new mongoose.Schema(
	{
		title: { type: String, trim: true, required: true, index: true },
		description: { type: String, required: true },
		position: { type: Number, required: true },
		cta: {
			label: { type: String, required: true },
			url: { type: String, required: true },
		},
		image: {
			name: { type: String },
			url: { type: String },
		},
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

export default mongoose.models.Slide ||
	mongoose.model('Slide', SlideSchema)
