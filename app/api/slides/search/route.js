import Slide from '@/models/Slide'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const slides = await Slide.find({
			$or: [
				{ title: { $regex: query, $options: 'i' } },
				{ description: { $regex: query, $options: 'i' } },
				{ 'cta.label': { $regex: query, $options: 'i' } },
			],
		})
			.sort({ createdAt: 'desc' })
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
			{
				status: 500,
			}
		)
	}
}
