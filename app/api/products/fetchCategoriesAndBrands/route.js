import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	try {
		await connectToDB()

		const fetchBrandsQuery = Brand.find({ isActive: true })
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
			.select('name')
			.lean()

		const fetchCategoriesQuery = Category.find({ isActive: true })
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
			.select('name')
			.lean({ autopopulate: false })

		const [categories, brands] = await Promise.all([
			fetchCategoriesQuery,
			fetchBrandsQuery,
		])

		const data = {
			categories,
			brands,
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
