import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
	{
		subject: { type: String, required: true },
		body: { type: String, required: true },
		sender: {
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			email: { type: String, required: true },
			phone: { type: String, required: true },
			companyName: { type: String },
		},
		acknowledgedOn: { type: Date, default: null },
		attendedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		status: { type: String, default: 'pending' },
		completedOn: { type: Date, default: null },
		comments: [
			{
				author: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				createdAt: { type: Date, default: Date.now },
				updatedAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
)

export default mongoose.models.Message ||
	mongoose.model('Message', MessageSchema)
