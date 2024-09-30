import Order from '@/models/Order'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const totalProductsQuery = Product.count()
		const totalOrdersQuery = Order.count()

		const [productsCount, ordersCount] = await Promise.all([
			totalProductsQuery,
			totalOrdersQuery,
		])

		console.log(productsCount, ordersCount)
		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
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
