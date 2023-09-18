import Role from '@/models/Role'
import User from '@/models/User'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const users = await User.find({
			$or: [
				{ firstName: { $regex: queryRegx } },
				{ lastName: { $regex: queryRegx } },
				{ email: { $regex: queryRegx } },
			],
		})
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'role',
				model: 'Role',
				select: 'title',
			})
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: users,
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
