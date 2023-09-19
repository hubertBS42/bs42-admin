import mongoose from 'mongoose'

const SettingSchema = new mongoose.Schema(
	{
		carouselSlides: [
			{
				title: { type: String, required: true, trim: true },
				description: { type: String, required: true, trim: true },
				image: {
					name: { type: String, required: true },
					url: { type: String, required: true },
				},
				isActive: { type: Boolean, default: false },
			},
		],
		exchangeRate: {
			currency: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Currency',
			},
			currentRate: { type: Number, required: true },
			manualOverride: { type: Boolean, default: false },
		},
	},
	{ timestamps: true }
)

export default mongoose.models.Setting ||
	mongoose.model('Setting', SettingSchema)
