import Quotation from '@/models/Quotation'
import Order from '@/models/Order'
import User from '@/models/User'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'desc'
	const field = searchParams.get('sortBy') || 'createdAt'

	try {
		await connectToDB()
		const fetchQuotionsQuery = Quotation.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.populate({
				path: 'createdBy',
				model: 'User',
				select: 'firstName lastName',
			})
			.populate({
				path: 'order',
				model: 'Order',
				select: 'orderNumber',
			})
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.lean()

		const getQuotationsCountQuery = Quotation.count()

		const [quotations, count] = await Promise.all([
			fetchQuotionsQuery,
			getQuotationsCountQuery,
		])

		const data = {
			quotations,
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
