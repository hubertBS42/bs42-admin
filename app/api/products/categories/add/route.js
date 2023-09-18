import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()

		const newCategory = await Category.create(data)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newCategory,
			}),
			{ status: 201 }
		)
	} catch (error) {
		console.log(error.message)
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
