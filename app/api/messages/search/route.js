import Message from '@/models/Message'
import User from '@/models/User'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const messages = await Message.find({
			$or: [
				{ subject: { $regex: query, $options: 'i' } },
				{ body: { $regex: query, $options: 'i' } },
				{ status: { $regex: query, $options: 'i' } },
			],
		})
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'attendedBy',
				model: 'User',
			})
			.populate({
				path: 'comments.author',
				model: 'User',
			})
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: messages,
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
