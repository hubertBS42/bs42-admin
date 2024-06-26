import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
	{
		title: { type: String, trim: true, required: true, index: true },
		cardImg: {
			name: { type: String },
			url: { type: String },
		},
		town: { type: String, required: true },
		region: { type: String, required: true },
		date: { type: Date, required: true },
		media: [
			{
				type: { type: String },
				thumbnail: {
					name: { type: String },
					url: { type: String },
				},
				content: {
					name: { type: String },
					url: { type: String },
				},
			},
		],
		isCompleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
)

export default mongoose.models.Project ||
	mongoose.model('Project', ProjectSchema)
