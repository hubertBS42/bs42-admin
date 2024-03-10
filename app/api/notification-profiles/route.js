import NotificationProfile from '@/models/NotificationProfile'
import Credential from '@/models/Credential'
import Server from '@/models/Server'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'desc'
	const field = searchParams.get('sortBy') || 'updatedAt'
	try {
		await connectToDB()

		const profiles = await NotificationProfile.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.populate({
				path: 'admins.sender',
				model: 'Credential',
				populate: {
					path: 'server',
					model: 'Server',
				},
			})
			.populate({
				path: 'users.sender',
				model: 'Credential',
				populate: {
					path: 'server',
					model: 'Server',
				},
			})
			.lean()

		const count = await NotificationProfile.count()

		const data = {
			profiles,
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
