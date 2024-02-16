import Application from '@/models/Application'
import { connectToDB } from '@/utils/database'
import { sendMail } from '@/utils/mailer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	try {
		await connectToDB()
		const newApplication = await Application.create(data)

		if (!newApplication) throw new Error('Application process failed.')

		sendMail({
			sender: {
				title: 'BS42.NET Support',
				email: 'notify@bs42.net',
			},
			subject: 'Account Registration',
			toEmail: newApplication.email,
			message: `Hello ${newApplication.firstName}, we have received your application. We will need to verify your details before your account is enabled and we may need to contact you for more information.`,
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newApplication,
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
