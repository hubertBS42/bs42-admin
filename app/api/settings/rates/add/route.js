import Rate from '@/models/Rate'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const POST = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const rate = await Rate.create(data)

		if (rate) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message: null,
					data: rate,
				}),
				{ status: 201 }
			)
		}
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
