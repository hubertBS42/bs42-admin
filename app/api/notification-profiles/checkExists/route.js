import NotificationProfile from '@/models/NotificationProfile'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const label = searchParams.get('label')

	try {
		await connectToDB()
		const profile = await NotificationProfile.findOne({ label })
			.collation({ locale: 'en' })
			.select('_id')
			.lean()

		if (profile) {
			return new Response(
				JSON.stringify({
					status: 'failed',
					message:
						'A notification profile with that label already exists.',
					data: null,
				}),
				{
					status: 400,
				}
			)
		}

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: null,
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
