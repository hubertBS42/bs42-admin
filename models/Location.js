import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		type: {
			type: String,
			enum: ['facility', 'section', 'aisle', 'shelf', 'slot'],
			required: true,
		},
		address: {
			address: String,
			town: String,
			region: String,
			digitalAddress: String,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Location',
			default: null,
			autopopulate: true,
		},
		capacity: Number,
		length: Number,
		contact: {
			firstName: String,
			lastName: String,
			phone: String,
			email: String,
		},
		description: String,
		level: { type: Number },
		isDefault: { type: Boolean },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

LocationSchema.plugin(require('mongoose-autopopulate'))

const Location =
	mongoose.models.Location ||
	mongoose.model('Location', LocationSchema)

export default Location
