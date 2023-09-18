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
				id: { type: String },
				isActive: { type: Boolean, default: false },
			},
		],
		profileImg: {
			name: { type: String },
			url: { type: String },
		},
		password: { type: String, required: true },
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Role',
		},
		notes: { type: String },
		isActive: { type: Boolean, default: true },
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
