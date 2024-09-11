import mongoose from 'mongoose'

const RateSchema = new mongoose.Schema(
	{
		rate: { type: Number, required: true },
		currency: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Currency',
		},
	},
	{ timestamps: true }
)

const Rate =
	mongoose.models.Rate || mongoose.model('Rate', RateSchema)

export default Rate
