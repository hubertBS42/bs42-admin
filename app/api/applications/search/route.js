import Application from '@/models/Application'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const applications = await Application.find({
			$or: [
				{ firstName: { $regex: queryRegx } },
				{ lastName: { $regex: queryRegx } },
				{ email: { $regex: queryRegx } },
				{ phone1: { $regex: queryRegx } },
				{ phone2: { $regex: queryRegx } },
			],
		})
			.sort({ createdAt: 'desc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: applications,
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
