import { sendMail } from '@/utils/mailer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		sendMail({
			sender: {
				title: 'BS42.NET Notify',
				email: 'notify@bs42.net',
			},
			subject: 'Test Email',
			toEmail: 'hugheyq@gmail.com',
			message: 'This is an email sent from function app',
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
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
