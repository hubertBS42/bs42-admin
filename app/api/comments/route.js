import Comment from '@/models/Comment'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	const typeRef = searchParams.get('typeRef') || null

	try {
		await connectToDB()

		if (!typeRef) throw new Error('Missing parameter')

		const comments = await Comment.find({ typeRef })
			.collation({ locale: 'en' })
			.sort({ createdAt: 'asc' })
			.lean({ autopopulate: true })

		const data = {
			comments,
			count: comments.length,
		}

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data,
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
