import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'desc'
	const field = searchParams.get('sortBy') || 'createdAt'

	try {
		await connectToDB()
		const orders = await Order.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.lean()

		const count = await Order.count()

		const data = {
			orders,
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
