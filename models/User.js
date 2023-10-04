import { hash } from 'bcryptjs'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, trim: true },
		email: {
			type: String,
			trim: true,
			unique: true,
			required: true,
			index: true,
		},
		phone1: { type: String },
		phone2: { type: String },
		residentialAddress: {
			streetName: { type: String },
			digitalAddress: { type: String },
			area: { type: String },
			region: { type: String },
		},
		deliveryAddresses: [
			{
				streetName: { type: String },
				digitalAddress: { type: String },
				area: { type: String },
				region: { type: String },
				index: { type: String },
				isActive: { type: Boolean, default: false },
			},
		],
		profileImg: {
			name: { type: String },
			url: { type: String },
		},
		password: { type: String, default: 'default' },
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Role',
			default: '649c05fb491c938dd4241a90',
		},
		company: {
			name: { type: String, default: null },
			phone: { type: String, default: null },
			website: { type: String, default: null },
			address: {
				streetName: { type: String, default: null },
				digitalAddress: { type: String, default: null },
				area: { type: String, default: null },
				region: { type: String, default: null },
			},
		},
		notes: { type: String },
		isApproved: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
		canReceiveEmails: { type: Boolean, default: true },
	},
	{ timestamps: true }
)

// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await hash(user.password, 8)
	}

	next()
})

export default mongoose.models.User ||
	mongoose.model('User', UserSchema)
