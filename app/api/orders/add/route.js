import Cart from '@/models/Cart'
import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { configMailer, fetchProfile } from '@/utils/mailer'
import Invoice from '@/components/Invoice/Invoice'
import { renderToStream } from '@react-pdf/renderer'
import { generateRandomCode } from '@/utils/functions'

export const POST = async request => {
	const data = await request.json()
	const { searchParams } = new URL(request.url)
	let cartToken = searchParams.get('cartToken')
	let userID = searchParams.get('userID')

	cartToken = cartToken === 'null' ? null : cartToken
	userID = userID === 'null' ? null : userID

	try {
		await connectToDB()

		const generateOrderNumber = async () => {
			let orderNumber = generateRandomCode()
			const orderNumberExists = await Order.findOne({ orderNumber })
			if (orderNumberExists) return generateOrderNumber()
			return orderNumber
		}

		const orderNumber = await generateOrderNumber()
		// const invoiceNumber = generateInvoiceNumber()

		// const newOrder = await Order.create({
		// 	...data,
		// 	orderNumber,
		// 	invoice: {
		// 		number: invoiceNumber,
		// 	},
		// })
		const newOrder = await Order.create({
			...data,
			orderNumber,
		})

		if (!newOrder) throw new Error('Failed to create order')

		// const [stream, profile] = await Promise.all([
		// 	renderToStream(<Invoice data={newOrder} />),
		// 	fetchProfile('new-order'),
		// ])

		const profile = await fetchProfile('new-order')

		const { transporter, mailOptions } = await configMailer({
			group: 'admins',
			profile,
		})

		await transporter.sendMail(mailOptions)

		// const recipients = [
		// 	{
		// 		group: 'users',
		// 		variables: { firstName: newOrder.customerInfo.firstName },
		// 		toEmail: newOrder.customerInfo.email,
		// 		attachments: [
		// 			{
		// 				filename: `${invoiceNumber}.pdf`,
		// 				content: stream,
		// 				contentType: 'application/pdf',
		// 			},
		// 		],
		// 	},
		// 	{
		// 		group: 'admins',
		// 		variables: null,
		// 		toEmail: null,
		// 		attachments: null,
		// 	},
		// ]

		// recipients.forEach(async group => {
		// 	const { transporter, mailOptions } = await configMailer({
		// 		group: group.group,
		// 		variables: group.variables,
		// 		toEmail: group.toEmail,
		// 		attachments: group.attachments,
		// 		profile,
		// 	})

		// 	await transporter.sendMail(mailOptions)
		// })

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
