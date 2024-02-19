import Slide from '@/models/Slide'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newSlide = await Slide.create(data)

		if (!newSlide) throw new Error('Failed to add slide')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newSlide,
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
