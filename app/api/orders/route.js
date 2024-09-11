import Currency from '@/models/Currency'
import Order from '@/models/Order'
import Rate from '@/models/Rate'
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

		let currentRate

		if (currency.isCustomRate) {
			currentRate = currency.customRate
		} else {
			currentRate = await Rate.findOne({ currency: currency._id })
				.sort({ createdAt: -1 })
				.limit(1)
			currentRate = currentRate.rate
		}

		const data = {
			orders,
			count,
			currentRate,
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
