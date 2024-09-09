import User from '@/models/User'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const user = await User.authUser(
			'hubert@attelecomms.co.uk',
			'dextro18'
		)

		console.log(user)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'success',
				data: user,
			}),
			{ status: 201 }
		)
	} catch (error) {
		console.log(error)
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
