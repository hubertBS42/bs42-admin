import mongoose from 'mongoose'
import User from './User'
import { generatePassword } from '@/utils/functions'
import { sendMail } from '@/utils/mailer'

const ApplicationSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone1: {
			type: String,
			required: true,
		},
		company: {
			name: {
				type: String,
				required: true,
			},
		},
		canReceiveEmails: {
			type: Boolean,
			default: true,
		},
		isApproved: {
			type: Boolean,
			default: null,
		},
		reviewer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		reviewDate: {
			type: Date,
			default: null,
		},
		reviewNotes: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
)

ApplicationSchema.pre('save', async function (next) {
	const application = this

	if (application.isModified('isApproved')) {
		if (application.isApproved) {
			const preparedData = {
				application: application._id,
				firstName: application.firstName,
				lastName: application.lastName,
				email: application.email,
				phone1: application.phone1,
				company: {
					name: application.company.name,
				},
				password: generatePassword({
					useSymbols: true,
					useNumbers: true,
					useLowerCase: true,
					useUpperCase: true,
					passwordLength: 10,
				}),
				canReceiveEmails: application.canReceiveEmails,
			}

			sendMail({
				sender: {
					title: 'BS42.NET Support',
					email: 'notify@bs42.net',
				},
				subject: 'Account Activation',
				toEmail: application.email,
				message: `Hello ${application.firstName}, your account has been approved and activated. You may now be able to sign into your account using the following password. Make sure you change this password once you are logged in. Password: ${preparedData.password}`,
			})

			await User.create(preparedData)
		} else {
			sendMail({
				sender: {
					title: 'BS42.NET Support',
					email: 'notify@bs42.net',
				},
				subject: 'Account Activation',
				toEmail: application.email,
				message: `Hello ${application.firstName}, your application for an account has been rejected. The following  was the reason; ${application.reviewNotes}`,
			})
		}
	}

	next()
})

const Application =
	mongoose.models.Application ||
	mongoose.model('Application', ApplicationSchema)

export default Application
