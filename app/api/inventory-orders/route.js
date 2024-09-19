import InventoryOrder from '@/models/InventoryOrder'
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
		const fetchInventoryOrdersQuery = InventoryOrder.find()
			.collation({ locale: 'en' })
			.populate({ path: 'user', select: 'firstName lastName' })
			.populate({ path: 'supplier', select: 'name' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.lean()

		const getInventoryOrdersCountQuery = InventoryOrder.count()

		const [inventoryOrders, count] = await Promise.all([
			fetchInventoryOrdersQuery,
			getInventoryOrdersCountQuery,
		])

		const data = {
			inventoryOrders,
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
