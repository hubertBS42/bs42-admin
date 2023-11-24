import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const fetchCategoriesQuery = Category.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('name slug parent images isActive')
			.lean()

		const fetchBrandsQuery = Brand.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('-description -updatedAt')
			.lean()

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
