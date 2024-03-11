import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

//POST
export const POST = async (request, { params }) => {
	const { server, sender, toEmail, subject, message } =
		await request.json()

	// create transporter object
	const transporter = nodemailer.createTransport({
		host: server.host,
		port: server.port,
		secure: server.secure,
		auth: {
			user: sender.user,
			pass: sender.pass,
		},
	})

	try {
		await transporter.sendMail({
			from: `${sender.title} < ${sender.user} >`,
			to: toEmail,
			subject,
			html: message,
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message:
					'A test email has been successfully sent to the recipient.',
			}),
			{ status: 200 }
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
