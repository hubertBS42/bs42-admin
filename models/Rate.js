import mongoose from 'mongoose'

const RateSchema = new mongoose.Schema(
	{
		rate: { type: Number, required: true, default: 1 },
		currency: { type: String, required: true, default: 'USD' },
	},
	{ timestamps: true }
)

export default mongoose.models.Rate ||
	mongoose.model('Rate', RateSchema)
