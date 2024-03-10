import Slide from '@/models/Slide'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const slides = await Slide.find({ isActive: true })
			.sort({ position: 'asc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: slides,
			}),
			{
				status: 200,
			}
		)
	} catch (error) {
		return new Response(
			JSON.stringify({
				status: 'error',
				message: error.message,
				data: null,
			}),
			{ status: 500 }
		)
	}
}
