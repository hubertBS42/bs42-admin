import User from '@/models/User'
import { connectToDB } from '@/utils/database'
import { sendMail } from '@/utils/mailer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	try {
		await connectToDB()
		const newUser = await User.create({ ...data, isActive: false })

		if (!newUser) throw new Error('Failed to create user.')

		sendMail({
			sender: {
				title: 'BS42.NET Support',
				email: 'notify@bs42.net',
			},
			subject: 'Account Registration',
			toEmail: newUser.email,
			message: `Hello ${newUser.firstName}, we have received your application. We will need to verify your details before your account is enabled and we may need to contact you for more information.`,
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newUser,
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
