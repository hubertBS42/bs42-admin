import NotificationProfile from '@/models/Template'
import Credential from '@/models/Credential'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const profiles = await NotificationProfile.find({
			$or: [
				{ label: { $regex: query, $options: 'i' } },
				{ description: { $regex: query, $options: 'i' } },
			],
		})
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'admins.sender',
				model: 'Credential',
			})
			.populate({
				path: 'users.sender',
				model: 'Credential',
			})
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: profiles,
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
