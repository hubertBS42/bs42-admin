import Cart from '@/models/Cart'
import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import {
	generateInvoiceNumber,
	generateRandomCode,
} from '@/utils/functions'
import { renderToStream } from '@react-pdf/renderer'
import { fetchTemplate } from '@/utils/mailer'
import Invoice from '@/components/Invoice/Invoice'

export const POST = async request => {
	const data = await request.json()
	const { searchParams } = new URL(request.url)
	let cartToken = searchParams.get('cartToken')
	let userID = searchParams.get('userID')

	cartToken = cartToken === 'null' ? null : cartToken
	userID = userID === 'null' ? null : userID

	const timestamp = new Date()

	try {
		await connectToDB()

		const generateOrderNumber = async () => {
			let orderNumber = generateRandomCode()
			const orderNumberExists = await Order.findOne({ orderNumber })
			if (orderNumberExists) return generateOrderNumber()
			return orderNumber
		}

		const orderNumber = await generateOrderNumber()

		const startOfDay = timestamp
		startOfDay.setHours(0, 0, 0, 0) // Set to the beginning of the day

		const endOfDay = timestamp
		endOfDay.setHours(23, 59, 59, 999) // Set to the end of the day

		const lastOrder = await Order.findOne({
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

		const newOrder = await Order.create({
			...data,
			orderNumber,
			status: [{ type: 'created', timestamp: new Date() }],
			invoice: {
				number: invoiceNumber,
				date: timestamp,
				dueDate: timestamp,
			},
		})

		if (!newOrder) throw new Error('Failed to create order')

		const [stream, template] = await Promise.all([
			renderToStream(<Invoice data={newOrder} />),
			fetchTemplate('order-created'),
		])

		const recipients = [
			{
				variables: {
					firstName: newOrder.contact.firstName,
					orderNumber,
				},
				toEmail: newOrder.contact.email,
				group: 'users',
				template,
				attachments: [
					{
						filename: `invoice_${invoiceNumber}.pdf`,
						content: stream,
						contentType: 'application/pdf',
					},
				],
			},
			{
				group: 'admins',
				variables: null,
				toEmail: null,
				attachments: null,
			},
		]

		recipients.forEach(async group => {
			const { transporter, mailOptions } = await configMailer({
				group: group.group,
				variables: group.variables,
				toEmail: group.toEmail,
				attachments: group.attachments,
				template,
			})

			await transporter.sendMail(mailOptions)
		})

		if (cartToken) {
			jwt.verify(cartToken, 'abc123')
			await Cart.findOneAndDelete({ token: cartToken })
		}

		if (userID) {
			await Cart.findOneAndDelete({ user: userID })
		}

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newOrder,
			}),
			{ status: 201 }
		)
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
				data: null,
			}),
			{
				status: 500,
			}
		)
	}
}
