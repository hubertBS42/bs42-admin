import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newLocation = await Location.create(data)

		if (!newLocation) throw new Error('Failed to add location.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newLocation,
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
