import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Currency from '@/models/Currency'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import Setting from '@/models/Setting'

export const GET = async request => {
	try {
		await connectToDB()

		const fetchProductsQuery = Product.find()
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
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

		const fetchCategoriesQuery = Category.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('name slug parent images isActive')
			.lean()

		const fetchSettingsQuery = Setting.find()
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
			.limit(1)
			.populate({
				path: 'exchangeRate.currency',
				model: 'Currency',
				select: '-exchangeRateHistory',
			})
			.lean()

		const fetchBrandsQuery = Brand.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('-description -updatedAt')
			.lean()

		const [products, categories, settings, brands] = await Promise.all([
			fetchProductsQuery,
			fetchCategoriesQuery,
			fetchSettingsQuery,
			fetchBrandsQuery,
		])

		const data = {
			products,
			categories,
			settings,
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
