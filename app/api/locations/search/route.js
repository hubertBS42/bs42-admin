import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const locations = await Location.find({
			$or: [
				{ name: { $regex: queryRegx } },
				{ phone: { $regex: queryRegx } },
				{ address: { $regex: queryRegx } },
				{ town: { $regex: queryRegx } },
				{ region: { $regex: queryRegx } },
				{ digitalAddress: { $regex: queryRegx } },
			],
		})
			.sort({ createdAt: 'desc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: locations,
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
