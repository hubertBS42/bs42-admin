import Currency from '@/models/Currency'
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
		const fetchOrdersQuery = Order.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.lean()

		const fetchCurrencyQuery = Currency.findOne({
			isActive: true,
		}).lean()

		const getOrdersCountQuery = Order.count()

		const [orders, currency, count] = await Promise.all([
			fetchOrdersQuery,
			fetchCurrencyQuery,
			getOrdersCountQuery,
		])

		const data = {
			orders,
			count,
			currentRate: currency.isCustomRate
				? currency.customRate
				: currency.history[0].rate,
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
