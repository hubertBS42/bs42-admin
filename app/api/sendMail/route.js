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
			subject: 'New Question or Comment',
			toEmail: 'info@bs42.net',
			message: `You have received the following message \n \n \nFirst name: ${data.firstName} \n Last name: ${data.lastName} \n Email: ${data.email} \n Phone number: ${data.phone} \n Company name: ${data.companyName} \n Comments or Question: ${data.question}`,
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
