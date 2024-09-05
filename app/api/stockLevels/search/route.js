import StockLevel from '@/models/StockLevel'
import Product from '@/models/Product'
import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')
	const location = searchParams.get('location')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const stockLevels = await StockLevel.find({ location })
			.populate({
				path: 'product',
				model: 'Product',
			})
			.populate({
				path: 'location',
				model: 'Location',
			})

		const filtered = stockLevels.filter(item => {
			if (queryRegx.test(item.product.title)) {
				return item
			}
		})

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: filtered,
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
