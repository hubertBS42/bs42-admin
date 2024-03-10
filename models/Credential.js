import mongoose from 'mongoose'

const CredentialSchema = new mongoose.Schema(
	{
		label: { type: String, required: true },
		user: { type: String, required: true },
		password: { type: String, default: null },
		server: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Server',
			required: true,
		},
		description: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

const Credential =
	mongoose.models.Credential ||
	mongoose.model('Credential', CredentialSchema)

export default Credential
