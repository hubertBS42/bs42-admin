import User from '@/models/User'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	const { email, password } = data
	try {
		await connectToDB()

		const user = await User.authUser(email, password)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: user,
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
