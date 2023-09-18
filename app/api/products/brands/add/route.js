import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newBrand = await Brand.create(data)

		if (!newBrand) throw new Error('Failed to create manufacturer')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newBrand,
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
