import Invoice from '@/components/Invoice/Invoice'
import { generateInvoiceNumber } from '@/utils/functions'
import { configMailer, fetchTemplate } from '@/utils/mailer'
import { renderToStream } from '@react-pdf/renderer'
import Product from './Product'
import Brand from './Brand'
import mongoose from 'mongoose'
import Location from './Location'
import StockLevel from './StockLevel'

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
			profileImg: { type: String },
		},
		billing: {
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
		},
		shipping: {
			firstName: { type: String },
			lastName: { type: String },
			phone: { type: String },
			region: { type: String },
			town: { type: String },
			address: { type: String },
			method: { type: String },
			cost: { type: Number, default: 0 },
			status: { type: String, default: 'pending' },
		},
		invoice: {
			number: { type: String },
			date: { type: Date },
			dueDate: { type: Date },
		},
		status: [
			{
				type: { type: String }, //created, processing, paymentReceived, delivering, delivered, pickedUp, cancelled
				timestamp: { type: Date },
			},
		],
		rate: { type: Number },
		discount: {
			type: {
				type: String,
				enum: ['percentage', 'amount'],
				default: 'percentage',
			},
			value: { type: Number, default: 0 },
			equivalent: { type: Number, default: 0 },
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
		const orderExistsQuery = this.constructor
			.findOne({
				orderNumber: this.orderNumber,
			})
			.select('_id status')
			.lean()

		const defaultLocationQuery = Location.findOne({
			isDefault: true,
			type: 'facility',
		})
			.select('_id')
			.lean({ autopopulate: false })

		const [orderExists, defaultLocation] = await Promise.all([
			orderExistsQuery,
			defaultLocationQuery,
		])

		if (!defaultLocation)
			throw new Error('Could not find a default location.')

		const products = order.products.map(product => ({
			_id: product.productRef,
			quantity: product.quantity,
		}))

		const toBeCreated = order.status.find(
			step => step.type === 'created'
		)

		const toBeCancelled = order.status.find(
			step => step.type === 'cancelled'
		)

		const cancelledAlready = orderExists?.status.find(
			step => step.type === 'cancelled'
		)

		if (toBeCreated && !orderExists) {
			const updateQuantityQueries = products.map(product =>
				StockLevel.findOneAndUpdate(
					{
						location: defaultLocation._id,
						product: product._id,
					},
					{ $inc: { count: -product.quantity } },
					{ new: true }
				).populate({ path: 'product', select: 'title' })
			)

			const stockLevels = await Promise.all(updateQuantityQueries)

			const lowStockItems = stockLevels.filter(
				item => item.count <= item.min
			)

			if (lowStockItems.length > 0) {
				const template = await fetchTemplate('low-stock')
				const { transporter, mailOptions } = await configMailer({
					variables: {
						items: lowStockItems.map(item => ({
							title: item.product.title,
							count: item.count,
						})),
					},
					group: 'admins',
					template,
				})
				await transporter.sendMail(mailOptions)
			}
		}

		if (toBeCancelled && !cancelledAlready) {
			const updateQuantityQueries = products.map(product =>
				StockLevel.findOneAndUpdate(
					{
						location: defaultLocation._id,
						product: product._id,
					},
					{ $inc: { count: product.quantity } }
				)
			)

			await Promise.all(updateQuantityQueries)
		}
	}

	next()
})

export default mongoose.models.Order ||
	mongoose.model('Order', OrderSchema)
