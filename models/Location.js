import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		phone: { type: String, required: true, trim: true },
		address: { type: String, required: true, trim: true },
		town: { type: String, required: true, trim: true },
		region: { type: String, required: true, trim: true },
		digitalAddress: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

const Location =
	mongoose.models.Location ||
	mongoose.model('Location', LocationSchema)

export default Location
