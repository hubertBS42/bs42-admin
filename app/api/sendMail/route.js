import { sendMail } from '@/utils/mailer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	// const data = await request.json()

	try {
		await sendMail(
			'TEST',
			'hugheyq@gmail.com',
			'This is a test to demonstrate that the scheduler is working'
		)

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
