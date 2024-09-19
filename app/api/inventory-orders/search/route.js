import InventoryOrder from '@/models/InventoryOrder'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const inventoryOrders = await InventoryOrder.find({
			$or: [{ orderNumber: { $regex: query, $options: 'i' } }],
		})
			.populate({ path: 'user', select: 'firstName lastName' })
			.populate({ path: 'supplier', select: 'name' })
			.sort({ createdAt: 'desc' })
			.lean()

		// const filtered = stockLevels.filter(item => {
		// 	if (queryRegx.test(item.product.title)) {
		// 		return item
		// 	}
		// })

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: inventoryOrders,
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
