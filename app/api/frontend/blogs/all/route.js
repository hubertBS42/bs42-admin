import User from '@/models/User'
import Blog from '@/models/Blog'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const blogs = await Blog.find({})
			.collation({ locale: 'en' })
			.populate({
				path: 'author',
				model: 'User',
				select: 'firstName lastName',
			})
			.lean()

		return new Response(
			JSON.stringify({
				blogs,
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
