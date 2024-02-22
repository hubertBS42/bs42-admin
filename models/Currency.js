import mongoose from 'mongoose'

const CurrencySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		abbreviation: { type: String, required: true },
		country: { type: String, required: true },
		symbol: { type: String, required: true },
		history: [
			{
				rate: { type: Number, required: true },
				timestamp: { type: Date, default: Date.now },
			},
		],
		customRate: { type: Number, default: 0 },
		isCustomRate: { type: Boolean, default: false },
		isActive: { type: Boolean, default: false },
	},
	{ timestamps: true }
)

CurrencySchema.pre('save', async function (next) {
	const currency = this

	if (currency.isModified('isActive')) {
		if (currency.isActive) {
			try {
				// Find active currency update to false
				const activeCurrency = await this.constructor.findOne({
					_id: { $ne: this._id },
					isActive: true,
				})

				if (activeCurrency) {
					activeCurrency.isActive = false
					await activeCurrency.save()
				}
			} catch (error) {
				console.error('Error updating active currency:', error)
				// Handle error
				return next(error)
			}
		}
	}

	next()
})

const Currency =
	mongoose.models.Currency ||
	mongoose.model('Currency', CurrencySchema)

export default Currency
