import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()

		const product = await Product.create(data)

		if (product) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message: null,
					data: product,
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
