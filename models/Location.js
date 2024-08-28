import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const LocationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, unique: true },
		slug: { type: String, slug: 'name', unique: true },
		phone: { type: String, required: true, trim: true },
		address: { type: String, required: true, trim: true },
		town: { type: String, required: true, trim: true },
		region: { type: String, required: true, trim: true },
		digitalAddress: { type: String, trim: true },
		isDefault: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

const Location =
	mongoose.models.Location ||
	mongoose.model('Location', LocationSchema)

export default Location
