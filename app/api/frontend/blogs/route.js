import User from '@/models/User'
import Blog from '@/models/Blog'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query =
		searchParams.get('q') === 'null' ? null : searchParams.get('q')
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 25
	const sortBy = searchParams.get('sortBy') || 'newest'
	const period =
		searchParams.get('period') === 'null'
			? null
			: searchParams.get('period')

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

		default:
			field = 'createdAt'
			order = 'desc'
			break
	}

	let blogsQuery = {}

	try {
		await connectToDB()

		if (query) {
			const queryRegx = new RegExp(query, 'i')
			blogsQuery.title = { $regex: queryRegx }
			blogsQuery.excerpt = { $regex: queryRegx }
		}

		// if (period) {
		// 	let categories = await Category.find().select('slug parent').lean()

		// 	categories = categories.map(category => {
		// 		return {
		// 			...category,
		// 			_id: category._id.toString(),
		// 			parent: category.parent?.toString() || null,
		// 		}
		// 	})

		// 	const groupedCategories = groupCategories(categories)

		// 	const categoriesIds = findIdsOfCategoryAndChildrenBySlug(
		// 		groupedCategories,
		// 		category
		// 	)

		// 	if (categoriesIds.length > 0) {
		// 		productsQuery.category = { $in: categoriesIds }
		// 	}
		// }

		// if (brand) {
		// 	const slugs = brand.split(',')
		// 	const documents = await Brand.find({ slug: { $in: slugs } })
		// 		.select('_id')
		// 		.lean()

		// 	if (documents.length > 0) {
		// 		const brandIds = documents.map(document => document._id)
		// 		productsQuery.brand = { $in: brandIds }
		// 	}
		// }

		// if (sortBy === 'featured') productsQuery.featured = true

		// if (condition) productsQuery.condition = condition

		const fetchBlogsQuery = Blog.find(blogsQuery)
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: order })
			.populate({
				path: 'author',
				model: 'User',
				select: 'firstName lastName',
			})
			.lean()

		const getCountQuery = Blog.count(blogsQuery)

		const [blogs, count] = await Promise.all([
			fetchBlogsQuery,
			getCountQuery,
		])

		return new Response(
			JSON.stringify({
				blogs,
				count,
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
