import Rate from '@/models/Rate'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()
	const { id } = params

	try {
		await connectToDB()

		await Rate.findOneAndUpdate({ _id: id }, data)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: null,
				message: 'Rate was updated successfully.',
			}),
			{ status: 200 }
		)
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}
