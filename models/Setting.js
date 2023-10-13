import mongoose from 'mongoose'
import User from './User'

const SettingSchema = new mongoose.Schema(
	{
		carouselSlides: [
			{
				title: { type: String, required: true, trim: true },
				description: { type: String, required: true, trim: true },
				index: { type: String, required: true, trim: true },
				cta: {
					label: { type: String, required: true, trim: true },
					url: { type: String, required: true, trim: true },
				},
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
		notifications: {
			newApplications: {
				recipients: [
					{
						user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
					},
				],
			},
		},
	},
	{ timestamps: true }
)

export default mongoose.models.Setting ||
	mongoose.model('Setting', SettingSchema)
