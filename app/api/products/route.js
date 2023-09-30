import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import Setting from '@/models/Setting'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'desc'
	const field = searchParams.get('sortBy') || 'createdAt'

	try {
		await connectToDB()

		const fetchProductsQuery = Product.find()
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: sort })
			.populate({
				path: 'brand',
				model: 'Brand',
				select: 'name',
			})
			.lean()

		const fetchCurrentRateQuery = Setting.find()
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
			.limit(1)
			.select('exchangeRate.currentRate')
			.lean()

		const fetchDisabledProductsQuery = Product.find({
			$or: [{ brand: null }, { category: null }],
		})
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'brand',
				model: 'Brand',
				select: 'name',
			})
			.lean()

		const getCountQuery = Product.count()

		const fetchCategoriesQuery = Category.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('name parent isActive')
			.lean()

		const fetchBrandsQuery = Brand.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('name isActive')
			.lean()

		const [
			products,
			currentRate,
			disabledProducts,
			count,
			categories,
			brands,
		] = await Promise.all([
			fetchProductsQuery,
			fetchCurrentRateQuery,
			fetchDisabledProductsQuery,
			getCountQuery,
			fetchCategoriesQuery,
			fetchBrandsQuery,
		])

		const data = {
			products,
			currentRate,
			disabledProducts,
			count,
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
