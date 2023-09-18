import User from '@/models/User'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const email = searchParams.get('email')

	try {
		await connectToDB()
		const user = await User.findOne({ email })
			.collation({ locale: 'en' })
			.select('_id')
			.lean()

		if (user) {
			return new Response(
				JSON.stringify({
					status: 'failed',
					message: 'A user with that email address already exsists.',
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
