import mongoose from 'mongoose'
import User from './User'
import { generatePassword } from '@/utils/functions'
import { configMailer, fetchTemplate } from '@/utils/mailer'

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
				billingActive: false,
				billing: null,
				shipping: [],
				password: generatePassword({
					useSymbols: true,
					useNumbers: true,
					useLowerCase: true,
					useUpperCase: true,
					passwordLength: 10,
				}),
				canReceiveEmails: application.canReceiveEmails,
			}

			await User.create(preparedData)

			const template = await fetchTemplate(
				'account-application-approval'
			)

			const { transporter, mailOptions } = await configMailer({
				variables: {
					firstName: application.firstName,
					password: preparedData.password,
				},
				toEmail: application.email,
				group: 'users',
				template,
			})

			await transporter.sendMail(mailOptions)
			console.log('sent')
		} else {
			const template = await fetchTemplate(
				'account-application-rejection'
			)

			const { transporter, mailOptions } = await configMailer({
				variables: {
					firstName: application.firstName,
					reviewNotes: application.reviewNotes || 'N/A',
				},
				toEmail: application.email,
				group: 'users',
				template,
			})

			await transporter.sendMail(mailOptions)
		}
	}

	next()
})

const Application =
	mongoose.models.Application ||
	mongoose.model('Application', ApplicationSchema)

export default Application
