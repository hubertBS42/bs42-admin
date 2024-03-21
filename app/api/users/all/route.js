import User from '@/models/User'
import Role from '@/models/Role'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const sort = searchParams.get('sort') || 'asc'
	const field = searchParams.get('sortBy') || 'firstName'

	try {
		await connectToDB()
		const usersQuery = User.find()
			.collation({ locale: 'en' })
			.sort({ [field]: sort })
			.populate({
				path: 'role',
				model: 'Role',
				select: 'title',
			})
			.lean()

		const countQuery = User.count()

		const [users, count] = await Promise.all([usersQuery, countQuery])

		const data = {
			users,
			count,
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
