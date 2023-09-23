import mongoose from 'mongoose'

const CurrencySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			default: 'United States Dollar',
		},
		abbreviation: { type: String, required: true, default: 'USD' },
		country: { type: String, required: true, default: 'United States' },
		symbol: { type: String, required: true, default: '$' },
		history: [
			{
				rate: { type: Number, required: true },
				timestamp: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
)

export default mongoose.models.Currency ||
	mongoose.model('Currency', CurrencySchema)
