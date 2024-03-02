import Server from '@/models/Server'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const label = searchParams.get('label')

	try {
		await connectToDB()
		const server = await Server.findOne({ label })
			.collation({ locale: 'en' })
			.select('_id')
			.lean()

		if (server) {
			return new Response(
				JSON.stringify({
					status: 'failed',
					message: 'A server with that label already exsists.',
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
