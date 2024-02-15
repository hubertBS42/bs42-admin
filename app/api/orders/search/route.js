import Blog from '@/models/Blog'
import User from '@/models/User'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const blogs = await Blog.find({
			$or: [{ title: { $regex: queryRegx } }],
		})
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'author',
				model: 'User',
				select: 'firstName lastName',
			})
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: blogs,
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
