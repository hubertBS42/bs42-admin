import Invoice from '@/components/Invoice/Invoice'
import { configMailer, fetchTemplate } from '@/utils/mailer'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	try {
		const [stream, template] = await Promise.all([
			renderToStream(<Invoice data={data} />),
			fetchTemplate('send-invoice'),
		])

		// const recipients = [
		// 	{
		// 		group: 'users',
		// 		variables: {
		// 			firstName: data.recipientFirstName,
		// 			lastName: data.recipientLastName,
		// 			orderNumber: data.orderNumber,
		// 		},
		// 		toEmail: data.recipientEmail,
		// 		attachments: [
		// 			{
		// 				filename: `invoice_${data.invoice.number}.pdf`,
		// 				content: stream,
		// 				contentType: 'application/pdf',
		// 			},
		// 		],
		// 	},
		// 	{
		// 		group: 'admins',
		// 	},
		// ]

		const { transporter, mailOptions } = await configMailer({
			group: 'users',
			variables: {
				firstName: data.recipientFirstName,
				lastName: data.recipientLastName,
				orderNumber: data.orderNumber,
			},
			toEmail: data.recipientEmail,
			attachments: [
				{
					filename: `invoice_${data.invoice.number}.pdf`,
					content: stream,
					contentType: 'application/pdf',
				},
			],
			template,
		})

		await transporter.sendMail(mailOptions)

		// recipients.forEach(async group => {
		// 	const { transporter, mailOptions } = await configMailer({
		// 		group: group.group,
		// 		variables: group.variables,
		// 		toEmail: group.toEmail,
		// 		attachments: group.attachments,
		// 		template,
		// 	})

		// 	await transporter.sendMail(mailOptions)
		// })

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
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
