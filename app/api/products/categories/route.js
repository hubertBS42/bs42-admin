import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'desc'
	const field = searchParams.get('sortBy') || 'createdAt'

	try {
		await connectToDB()

		const fetchLimitedCategoriesQuery = Category.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.lean({ autopopulate: false })

		const fetchAllCategoriesQuery = Category.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			// .select('name parent isActive')
			.lean({ autopopulate: false })

		const getCountQuery = Category.count()

		const [limitedCategories, count, allCategories] = await Promise.all(
			[
				fetchLimitedCategoriesQuery,
				getCountQuery,
				fetchAllCategoriesQuery,
			]
		)

		const data = {
			limitedCategories,
			count,
			allCategories,
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
