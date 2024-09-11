import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const { searchParams } = new URL(request.url)
	const data = await request.json()

	try {
		const transporter = nodemailer.createTransport({
			host: data.server.host,
			port: data.server.port,
			secure: data.server.secure, // true for port 465, false for other ports
			auth: {
				user: data.sender.user,
				pass: data.sender.pass,
			},
		})

		await transporter.sendMail({
			from: `${data.sender.title} < ${data.sender.user} >`, // sender address
			to: data.toEmail, // list of receivers
			subject: data.subject, // Subject line
			text: data.message, // plain text body
			html: `<b>${data.message}</b>`, // html body
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Test email has been sent successfully.',
			}),
			{ status: 201 }
		)
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{
				status: 500,
			}
		)
	}
}
