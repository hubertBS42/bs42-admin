import mongoose from 'mongoose'

const ServerSchema = new mongoose.Schema(
	{
		label: {
			type: String,
			required: true,
			unique: true,
		},
		host: { type: String, required: true },
		port: { type: Number, required: true },
		isSecure: { type: Boolean, default: true },
		description: { type: String },
		credentials: [
			{
				title: { type: String, required: true },
				user: { type: String, required: true },
				password: { type: String, default: null },
				fromEmail: { type: String, required: true },
				timestamp: { type: Date, default: Date.now },
				description: { type: String },
			},
		],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

const Server =
	mongoose.models.Server || mongoose.model('Server', ServerSchema)

export default Server
