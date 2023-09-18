import Resource from '@/models/Resource'
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
		const rolesQuery = Role.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.populate({
				path: 'permissions',
				populate: {
					path: 'resource',
					model: 'Resource',
					select: 'name',
				},
			})
			.lean()

		const countQuery = Role.count()

		const fetchResourcesQuery = Resource.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('name')
			.lean()

		const [roles, count, resources] = await Promise.all([
			rolesQuery,
			countQuery,
			fetchResourcesQuery,
		])

		const data = {
			roles,
			count,
			resources,
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
