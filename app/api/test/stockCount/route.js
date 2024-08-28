import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		let results = await Product.find()
			.select('countInStock sku unitsSold')
			.lean()
		results = results.map(item => ({
			product: item._id,
			location: '66cdf59925b6aaa1e2faf682',
			sku: item.sku,
			count: item.countInStock,
			unitsSold: item.unitsSold,
			min: 1,
			max: 1,
		}))

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: results,
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
