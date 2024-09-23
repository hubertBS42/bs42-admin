import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
	{
		typeRef: {
			type: String,
			required: true,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			default: null,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			autopopulate: true,
			required: true,
		},
		body: { type: String, required: true },
	},
	{ timestamps: true }
)

CommentSchema.plugin(require('mongoose-autopopulate'))

export default mongoose.models.Comment ||
	mongoose.model('Comment', CommentSchema)
