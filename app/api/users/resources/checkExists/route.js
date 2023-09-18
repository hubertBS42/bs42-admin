import Resource from '@/models/Resource'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const name = searchParams.get('name')

	try {
		await connectToDB()
		const resource = await Resource.findOne({ name })
			.collation({ locale: 'en' })
			.select('_id')
			.lean()

		if (resource) {
			return new Response(
				JSON.stringify({
					status: 'failed',
					message: 'A resource with that name already exsists.',
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
