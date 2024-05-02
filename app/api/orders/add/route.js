import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import { configMailer, fetchTemplate } from '@/utils/mailer'
import Invoice from '@/components/Invoice/Invoice'
import { renderToStream } from '@react-pdf/renderer'
import {
	generateInvoiceNumber,
	generateRandomCode,
} from '@/utils/functions'

export const POST = async request => {
	const data = await request.json()
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const generateOrderNumber = async () => {
			let orderNumber = generateRandomCode()
			const orderNumberExists = await Order.findOne({ orderNumber })
			if (orderNumberExists) return generateOrderNumber()
			return orderNumber
		}

		const orderNumber = await generateOrderNumber()

		const startOfDay = new Date().setHours(0, 0, 0, 0) // Set to the beginning of the day

		const endOfDay = new Date().setHours(23, 59, 59, 999) // Set to the end of the day

		const lastOrder = await Order.findOne({
			'invoice.date': {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		})
			.sort({ createdAt: 'desc' }) // Sort by createdAt in descending order
			.lean()

		const lastInvoiceNumber = lastOrder?.invoice?.number || 0

		const invoiceNumber = generateInvoiceNumber(lastInvoiceNumber)

		const newOrder = await Order.create({
			...data,
			orderNumber,
			invoice: { ...data.invoice, number: invoiceNumber },
		})

		if (!newOrder) throw new Error('Failed to create order')

		if (data.invoice.email) {
			const [stream, template] = await Promise.all([
				renderToStream(<Invoice data={newOrder} />),
				fetchTemplate('order-placed'),
			])

			const recipients = [
				{
					group: 'users',
					variables: {
						firstName: newOrder.contact.firstName,
						orderNumber: newOrder.orderNumber,
					},
					toEmail: newOrder.contact.email,
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
		} else {
			const template = await fetchTemplate('order-placed')

			const { transporter, mailOptions } = await configMailer({
				group: 'admins',
				template,
			})

			await transporter.sendMail(mailOptions)
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
