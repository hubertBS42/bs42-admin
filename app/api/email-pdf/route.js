import Invoice from '@/components/Invoice/Invoice'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const GET = async request => {
	// let data = await request.json()

	const transporter = nodemailer.createTransport({
		host: 'mail.bs42.co.uk',
		port: 465,
		secure: true, // Use `true` for port 465, `false` for all other ports
		auth: {
			user: 'notify@bs42.net',
			pass: 'tiscragi66',
		},
	})

	try {
		// const stream = await renderToStream(<Invoice data={data} />)

		await transporter.sendMail({
			from: 'Notify BS42.NET <notify@bs42.net>', // sender address
			to: 'hugheyq@gmail.com', // list of receivers
			subject: 'TEST EMAIL WITH ATTACHMENT', // Subject line
			html: '<b>Hello world?</b>', // html body
			// attachments: [
			// 	{
			// 		filename: 'my-pdf.pdf',
			// 		content: stream,
			// 		contentType: 'application/pdf',
			// 	},
			// ],
		})

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
