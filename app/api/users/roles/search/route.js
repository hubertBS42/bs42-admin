import Role from '@/models/Role'
import Resource from '@/models/Resource'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const roles = await Role.find({
			$or: [
				{ title: { $regex: queryRegx } },
				{ description: { $regex: queryRegx } },
			],
		})
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'permissions',
				populate: {
					path: 'resource',
					model: 'Resource',
					select: 'name',
				},
			})
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: roles,
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
