import { hash } from 'bcryptjs'
import mongoose from 'mongoose'
import { compare } from 'bcryptjs'
import Role from './Role'
import Resource from './Resource'
import Application from './Application'

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
		billingActive: { type: Boolean, default: false },
		billing: {
			firstName: { type: String, trim: true },
			lastName: { type: String, trim: true },
			email: { type: String, trim: true },
			address: { type: String },
			town: { type: String },
			region: { type: String },
		},
		shipping: [
			{
				firstName: { type: String },
				lastName: { type: String },
				phone: { type: String },
				address: { type: String },
				town: { type: String },
				region: { type: String },
				index: { type: String },
				isPrimary: { type: Boolean, default: false },
			},
		],
		profileImg: {
			name: { type: String },
			url: { type: String },
		},
		password: { type: String, default: null },
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Role',
			default: '649c05fb491c938dd4241a90',
		},
		company: {
			name: { type: String, default: null },
			phone: { type: String, default: null },
			website: { type: String, default: null },
			address: { type: String, default: null },
			digitalAddress: { type: String, default: null },
			town: { type: String, default: null },
			region: { type: String, default: null },
		},
		notes: { type: String },
		isActive: { type: Boolean, default: true },
		canReceiveEmails: { type: Boolean, default: true },
		application: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Application',
			default: null,
		},
	},
	{ timestamps: true }
)

UserSchema.statics.authUser = async function (email, password) {
	if (!email || !password) {
		throw new Error('Email and password is required to login')
	}

	const user = await User.findOne({ email })
		.populate({
			path: 'role',
			model: 'Role',
			select: 'title',
			populate: {
				path: 'permissions.resource',
				model: 'Resource',
				select: 'name',
			},
		})
		.select(
			'firstName lastName email phone1 phone2 shipping billing password isActive role profileImg'
		)
		.lean()

	if (!user) {
		throw new Error('Incorrect login details.')
	}

	const validPassword = await compare(password, user.password)

	if (!validPassword) {
		throw new Error('Incorrect login details.')
	}

	if (!user.isActive) {
		throw new Error('This account is not active.')
	}

	delete user.password

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
