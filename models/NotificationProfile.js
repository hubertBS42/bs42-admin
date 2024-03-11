import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const NotificationProfileSchema = new mongoose.Schema(
	{
		label: { type: String, required: true },
		slug: { type: String, slug: 'label', unique: true },
		admins: {
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Credential',
			},
			recipients: [{ type: String, trim: true }],
			subject: { type: String },
			message: { type: String },
		},
		users: {
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Credential',
			},
			subject: { type: String },
			message: { type: String },
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
