import User from '@/models/User'
import Role from '@/models/Role'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'desc'
	const field = searchParams.get('sortBy') || 'createdAt'

	try {
		await connectToDB()
		const usersQuery = User.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.populate({
				path: 'role',
				model: 'Role',
				select: 'title',
			})
			.lean()

		const countQuery = User.count()

		const fetchRolesQuery = Role.find()
			.collation({ locale: 'en' })
			.sort({ title: 'asc' })
			.select('title')
			.lean()

		const [users, count, roles] = await Promise.all([
			usersQuery,
			countQuery,
			fetchRolesQuery,
		])

		const data = {
			users,
			count,
			roles,
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
