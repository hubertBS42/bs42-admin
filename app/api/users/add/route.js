import User from '@/models/User'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	try {
		await connectToDB()
		const newUser = await User.create(data)

		if (!newUser) throw new Error('Failed to create user.')

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
