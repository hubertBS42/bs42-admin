import StockLevel from '@/models/StockLevel'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import Location from '@/models/Location'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const defaultLocationQuery = Location.findOne({
			isDefault: true,
			type: 'facility',
		})
			.select('_id')
			.lean({
				autopopulate: false,
			})

		const allProductsQuery = Product.find({ isActive: true })
			.collation({ locale: 'en' })
			.sort({ title: 'asc' })
			.select('title')
			.lean({ autopopulate: false })

		const [products, defaultLocation] = await Promise.all([
			allProductsQuery,
			defaultLocationQuery,
		])

		if (!defaultLocation)
			throw new Error('There is no set default location.')

		const productIds = products.map(product => product._id)

		const stock = await StockLevel.find({
			product: { $in: productIds },
			location: defaultLocation,
		})
			.select('product count')
			.lean({ autopopulate: false })

		const formattedProducts = products.map(product => {
			const match = stock.find(
				item => item.product.toString() === product._id.toString()
			)

			if (match) {
				return { ...product, count: match.count }
			} else {
				return { ...product, count: 0 }
			}
		})

		const total = formattedProducts.length
		let instock = 0
		let outOfStock = 0

		formattedProducts.forEach(product => {
			if (product.count > 0) {
				instock++
			} else {
				outOfStock++
			}
		})

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: {
					total,
					instock,
					outOfStock,
				},
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
