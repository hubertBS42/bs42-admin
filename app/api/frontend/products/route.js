import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import Setting from '@/models/Setting'
import {
	convertToDollar,
	findIdsOfCategoryAndChildrenBySlug,
	groupCategories,
} from '@/utils/functions'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 25
	// const sort = searchParams.get('sort') || 'desc'
	const sortBy = searchParams.get('sortBy') || 'newest'
	const category = searchParams.get('category') || null
	const brand = searchParams.get('brand') || null
	const condition = searchParams.get('condition') || null

	let field
	let order

	switch (sortBy) {
		case 'newest':
			field = 'createdAt'
			order = 'desc'
			break
		case 'a-z':
			field = 'title'
			order = 'asc'
			break
		case 'z-a':
			field = 'title'
			order = 'desc'
			break
		case 'priceLow':
			field = 'sellPrice'
			order = 'asc'
			break
		case 'priceHigh':
			field = 'sellPrice'
			order = 'desc'
			break

		default:
			field = 'createdAt'
			order = 'desc'
			break
	}

	const maxPrice =
		searchParams.get('maxPrice') === 'null'
			? null
			: searchParams.get('maxPrice')

	const minPrice =
		searchParams.get('minPrice') === 'null'
			? null
			: searchParams.get('minPrice')

	let productsQuery = {}
	let rate = null

	try {
		await connectToDB()

		if (minPrice || maxPrice) {
			const {
				exchangeRate: { currentRate },
			} = await Setting.findOne()
				.sort({ createdAt: -1 })
				.select('exchangeRate.currentRate')
				.lean()

			rate = currentRate
		}

		if (category) {
			let categories = await Category.find().select('slug parent').lean()

			categories = categories.map(category => {
				return {
					...category,
					_id: category._id.toString(),
					parent: category.parent?.toString() || null,
				}
			})

			const groupedCategories = groupCategories(categories)

			const categoriesIds = findIdsOfCategoryAndChildrenBySlug(
				groupedCategories,
				category
			)

			if (categoriesIds.length > 0) {
				productsQuery.category = { $in: categoriesIds }
			}
		}

		if (brand) {
			const slugs = brand.split(',')
			const documents = await Brand.find({ slug: { $in: slugs } })
				.select('_id')
				.lean()

			if (documents.length > 0) {
				const brandIds = documents.map(document => document._id)
				productsQuery.brand = { $in: brandIds }
			}
		}

		if (maxPrice && minPrice) {
			productsQuery.sellPrice = {
				$gte: convertToDollar(minPrice, rate),
				$lte: convertToDollar(maxPrice, rate),
			}
		} else if (minPrice) {
			productsQuery.sellPrice = { $gte: convertToDollar(minPrice, rate) }
		} else if (maxPrice) {
			productsQuery.sellPrice = { $lte: convertToDollar(maxPrice, rate) }
		}

		if (sortBy === 'featured') productsQuery.featured = true

		if (condition) productsQuery.condition = condition

		const fetchProductsQuery = Product.find(productsQuery)
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: order })
			.populate({
				path: 'brand',
				model: 'Brand',
				select: 'name',
			})
			.populate({
				path: 'category',
				model: 'Category',
				select: 'name',
			})
			.select(
				'title slug brand sellPrice resellerPrice images countInStock category unitsSold rating onSale featured discount isActive createdAt'
			)
			.lean()

		const getCountQuery = Product.count(productsQuery)

		const [products, count] = await Promise.all([
			fetchProductsQuery,
			getCountQuery,
		])

		return new Response(
			JSON.stringify({
				products,
				count,
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
			{ status: 500 }
		)
	}
}
