import mongoose from 'mongoose'

const SupplierSchema = new mongoose.Schema(
	{
		accountID: { type: String, trim: true },
		vatID: { type: String, trim: true },
		name: { type: String, required: true, trim: true },
		contact: {
			firstName: { type: String, trim: true },
			lastName: { type: String, trim: true },
			email: { type: String, trim: true },
			primaryPhone: { type: String, trim: true },
			secondaryPhone: { type: String, trim: true },
			fax: { type: String, trim: true },
		},
		address: {
			line1: { type: String, trim: true },
			line2: { type: String, trim: true },
			townCity: { type: String, trim: true },
			stateCounty: { type: String, trim: true },
			country: { type: String, trim: true },
			postCode: { type: String, trim: true },
		},
		notes: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

const Supplier =
	mongoose.models.Supplier ||
	mongoose.model('Supplier', SupplierSchema)

export default Supplier
