import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()

		const newStorage = await Location.create(data)

		if (!newStorage) throw new Error('Failed to add storage.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newStorage,
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
