import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Blog from '@/models/Blog'
import Currency from '@/models/Currency'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import Setting from '@/models/Setting'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
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

		const fetchCurrencyQuery = Currency.findOne({
			isActive: true,
		}).lean()

		const fetchBrandsQuery = Brand.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('-description -updatedAt')
			.lean()

		const fetchBlogsCount = Blog.count()

		const [products, categories, currency, brands, blogsCount] =
			await Promise.all([
				fetchProductsQuery,
				fetchCategoriesQuery,
				fetchCurrencyQuery,
				fetchBrandsQuery,
				fetchBlogsCount,
			])

		const data = {
			products,
			categories,
			currency,
			brands,
			blogsCount,
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
