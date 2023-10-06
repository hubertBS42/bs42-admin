import { hash } from 'bcryptjs'
import mongoose from 'mongoose'
import { compare } from 'bcryptjs'

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

UserSchema.methods.toJSON = function () {
	const user = this.toObject()

	delete user.password

	return user
}

UserSchema.statics.authUser = async function (email, password) {
	if (!email || !password) {
		throw new Error('Email and password is required to login')
	}

	const user = await User.findOne({ email })
		.populate({
			path: 'role',
			model: 'Role',
			select: '_id',
			populate: {
				path: 'permissions.resource',
				model: 'Resource',
				select: '_id',
			},
		})
		.select(
			'firstName lastName email password isActive isApproved role'
		)
		.lean()

	if (!user) {
		throw new Error('Incorrect login details.')
	}

	const validPassword = await compare(password, user.password)

	if (!validPassword) {
		throw new Error('Incorrect login details.')
	}

	if (user.isApproved === false) {
		throw new Error('This account has not been approved yet.')
	}

	if (!user.isActive) {
		throw new Error('This account is not active.')
	}

	return user
}

// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await hash(user.password, 8)
	}

	next()
})

const User =
	mongoose.models.User || mongoose.model('User', UserSchema)

export default User
