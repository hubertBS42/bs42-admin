import Blog from '@/models/Blog'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const count = await Blog.count()

		return new Response(
			JSON.stringify({
				status: 'success',
				data: count,
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
