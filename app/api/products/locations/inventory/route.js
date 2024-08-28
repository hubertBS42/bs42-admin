import Product from '@/models/Product'
import Location from '@/models/Location'
import Inventory from '@/models/Inventory'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	let location = searchParams.get('location') || 'default'
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'asc'
	const field = searchParams.get('sortBy') || 'count'

	try {
		await connectToDB()

		const locations = await Location.find().select('name isDefault')

		if (location === 'default') {
			location = locations.find(loc => loc.isDefault)._id
		}

		const limitedInventoryQuery = Inventory.find({ location })
			.populate({
				path: 'product',
				model: 'Product',
			})
			.populate({
				path: 'location',
				model: 'Location',
			})
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })

		const allInventoryQuery = Inventory.find({ location })
			.populate({
				path: 'product',
				model: 'Product',
				select: 'title',
			})
			.select('product')

		const inventoryCountQuery = Inventory.find({ location })
			.select('_id')
			.count()

		const productsQuery = Product.find()
			.collation({ locale: 'en' })
			.sort({ title: 'asc' })
			.select('title')
			.lean()

		let [limitedInventory, allInventory, count, products] =
			await Promise.all([
				limitedInventoryQuery,
				allInventoryQuery,
				inventoryCountQuery,
				productsQuery,
			])

		console.log(allInventory)

		allInventory = allInventory.map(item => ({
			_id: item.product._id,
			title: item.product.title,
		}))

		const unassigned = products.filter(
			product =>
				!allInventory.some(
					item => item._id.toString() === product._id.toString()
				)
		)

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: {
					limitedInventory,
					allInventory,
					available: unassigned,
					locations,
					count,
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
