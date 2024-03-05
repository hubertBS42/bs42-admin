import mongoose from 'mongoose'

const NotificationProfileSchema = new mongoose.Schema(
	{
		label: { type: String, required: true },
		admins: {
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Credential',
			},
			recipients: [{ type: String, trim: true }],
			title: { type: String },
			body: { type: String },
		},
		users: {
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Credential',
			},
			recipients: [{ type: String, trim: true }],
			title: { type: String },
			body: { type: String },
		},
		description: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

const NotificationProfile =
	mongoose.models.NotificationProfile ||
	mongoose.model('NotificationProfile', NotificationProfileSchema)

export default NotificationProfile
