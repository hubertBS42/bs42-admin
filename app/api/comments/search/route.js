import Comment from '@/models/Comment'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')
	const typeRef = searchParams.get('typeRef') || null

	try {
		await connectToDB()

		if (!typeRef) throw new Error('Missing parameter.')

		const queryRegx = new RegExp(query, 'i')

		const allComments = await Comment.find({ typeRef }).lean({
			autopopulate: true,
		})

		const filtered = allComments.filter(comment => {
			const userFirstNameMatch = queryRegx.test(comment.user.firstName)
			const userLastNameMatch = queryRegx.test(comment.user.lastName)
			const bodyMatch = regex.test(comment.body)

			// Return true if any of the fields match the regex
			return userFirstNameMatch || userLastNameMatch || bodyMatch
		})

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: filtered,
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
