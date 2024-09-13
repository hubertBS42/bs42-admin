import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import StockLevel from '@/models/StockLevel'
import Location from '@/models/Location'
export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const productsQuery = Product.find({
			$or: [
				{ title: { $regex: queryRegx } },
				{ slug: { $regex: queryRegx } },
			],
		})
			.sort({ title: 'asc' })
			// .populate({
			// 	path: 'brand',
			// 	select: 'name slug',
			// })
			// .populate({
			// 	path: 'category',
			// 	select: 'name slug',
			// })
			.select(
				'title slug brand images sellPrice category isActive createdAt'
			)
			.lean({ autopopulate: true })

		const defaultLocationQuery = Location.findOne({
			isDefault: true,
			type: 'facility',
		})
			.select('_id')
			.lean({ autopopulate: false })

		const [products, defaultLocation] = await Promise.all([
			productsQuery,
			defaultLocationQuery,
		])

		const productIds = products.map(product => product._id)

		const stock = await StockLevel.find({
			product: { $in: productIds },
			location: defaultLocation,
		})
			.select('product count location sku')
			.lean({ autopopulate: false })

		const formattedProducts = products.map(product => {
			const match = stock.find(
				item => item.product.toString() === product._id.toString()
			)

			if (match) {
				return { ...product, count: match.count, sku: match.sku }
			} else {
				return { ...product, count: 0, sku: '' }
			}
		})

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: formattedProducts,
			}),
			{
				status: 200,
			}
		)
	} catch (error) {
		console.log(error)
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
