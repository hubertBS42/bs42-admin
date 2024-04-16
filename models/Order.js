import Invoice from '@/components/Invoice/Invoice'
import { generateInvoiceNumber } from '@/utils/functions'
import { configMailer, fetchTemplate } from '@/utils/mailer'
import { renderToStream } from '@react-pdf/renderer'
import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
	{
		orderNumber: { type: String, required: true, unique: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		contact: {
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			phone: { type: String },
		},
		billing: {
			firstName: { type: String },
			lastName: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			digitalAddress: { type: String },
		},
		shipping: {
			firstName: { type: String },
			lastName: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			digitalAddress: { type: String },
			method: { type: String },
			cost: { type: Number, default: 0 },
			status: { type: String, default: 'pending' },
		},
		invoice: {
			number: { type: String },
			date: { type: Date },
			dueDate: { type: Date },
		},
		status: { type: String, default: 'placed' }, //placed, pending, confirmed, rejected, ready/shipped, delivering, pickedUp/delivered
		rate: { type: Number },
		discount: {
			percentage: { type: Number, default: 0 },
			reason: { type: String },
		},
		products: [
			{
				productRef: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
				title: { type: String },
				brand: {
					name: { type: String },
				},
				category: {
					type: [String],
				},
				images: [{ name: { type: String }, url: { type: String } }],
				quantity: { type: Number, default: 1 },
				price: { type: Number },
			},
		],
		total: { type: Number },
		subtotal: { type: Number },
		payment: {
			method: { type: String },
			status: { type: String, default: 'pending' },
		},
		trackingInfo: {
			carrier: { type: String },
			trackingNumber: { type: String },
		},
		coupons: [
			{
				code: { type: String },
				amount: { type: Number },
			},
		],
		notes: { type: String },
		returnInfo: {
			requested: { type: Boolean, default: false },
			reason: { type: String },
			status: { type: String },
		},
		customerFeedback: {
			rating: { type: Number },
			comment: { type: String },
		},
	},
	{ timestamps: true }
)

OrderSchema.pre('save', async function (next) {
	const order = this

	if (order.isModified('status')) {
		if (order.status === 'confirmed') {
			const timestamp = new Date()

			const startOfDay = timestamp
			startOfDay.setHours(0, 0, 0, 0) // Set to the beginning of the day

			const endOfDay = timestamp
			endOfDay.setHours(23, 59, 59, 999) // Set to the end of the day

			const lastOrder = await this.constructor
				.findOne({
					'invoice.date': {
						$gte: startOfDay,
						$lte: endOfDay,
					},
				})
				.sort({ createdAt: 'desc' }) // Sort by createdAt in descending order
				.lean()

			const lastInvoiceNumber = lastOrder?.invoice?.number || 0

			const invoiceNumber = generateInvoiceNumber(
				lastInvoiceNumber,
				timestamp
			)

			order.invoice = {
				number: invoiceNumber,
				date: timestamp,
				dueDate: timestamp,
			}

			const [stream, template] = await Promise.all([
				renderToStream(<Invoice data={order} />),
				fetchTemplate('confirm-order'),
			])

			const { transporter, mailOptions } = await configMailer({
				variables: {
					firstName: order.contact.firstName,
				},
				toEmail: order.contact.email,
				group: 'users',
				template,
				attachments: [
					{
						filename: `${invoiceNumber}.pdf`,
						content: stream,
						contentType: 'application/pdf',
					},
				],
			})

			await transporter.sendMail(mailOptions)
		} else {
			// const template = await fetchTemplate(
			// 	'account-application-rejection'
			// )
			// const { transporter, mailOptions } = await configMailer({
			// 	variables: {
			// 		firstName: application.firstName,
			// 		reviewNotes: application.reviewNotes || 'N/A',
			// 	},
			// 	toEmail: application.email,
			// 	group: 'users',
			// 	template,
			// })
			// await transporter.sendMail(mailOptions)
		}
	}

	next()
})

export default mongoose.models.Order ||
	mongoose.model('Order', OrderSchema)
