import mongoose from 'mongoose'

const ApplicationSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		companyName: {
			type: String,
			required: true,
		},
		canReceiveEmails: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.models.Application ||
	mongoose.model('Application', ApplicationSchema)
