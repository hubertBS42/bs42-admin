import Role from '@/models/Role'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const title = searchParams.get('title')

	try {
		await connectToDB()
		const role = await Role.findOne({ title })
			.collation({ locale: 'en' })
			.select('_id')
			.lean()

		console.log(role)

		if (role) {
			return new Response(
				JSON.stringify({
					status: 'failed',
					message: 'A role with that title already exsists.',
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
