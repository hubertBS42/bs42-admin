import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const brands = await Brand.find({
			$or: [{ name: { $regex: queryRegx } }],
		})
			.sort({ createdAt: 'desc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: brands,
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
