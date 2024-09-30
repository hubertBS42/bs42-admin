import StockLevel from '@/models/StockLevel'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import Location from '@/models/Location'
import Brand from '@/models/Brand'
import Category from '@/models/Category'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const formatCategories = (categories, parent = null) => {
			return categories
				.filter(category => category.parent === parent)
				.map(category => ({
					...category,
					children: formatCategories(categories, category._id),
				}))
		}

		const extractIds = category => {
			let ids = [category._id]
			const { children } = category
			for (const child of children) {
				ids.push(child._id)
				if (child.children && child.children.length > 0) {
					// Recursively extract ids from children
					ids.push(...extractIds(child))
				}
			}

			return ids
		}

		const allCategoriesQuery = Category.find({ isActive: true })
			.select('name parent')
			.lean({
				autopopulate: false,
			})

		const allProductsQuery = Product.find({ isActive: true })
			.select('category')
			.lean({ autopopulate: false })

		const [allCategories, allProducts] = await Promise.all([
			allCategoriesQuery,
			allProductsQuery,
		])

		const strippedCategories = allCategories.map(category => ({
			...category,
			_id: category._id.toString(),
			parent: category.parent ? category.parent.toString() : null,
		}))

		const groupedCategories = formatCategories(strippedCategories)

		const formattedCategories = groupedCategories.map(category => ({
			...category,
			categoryIds: extractIds(category),
		}))

		const preparedData = formattedCategories.map(category => {
			let count = 0
			allProducts.forEach(product => {
				if (category.categoryIds.includes(product.category.toString())) {
					count++
				}
			})

			return {
				name: category.name,
				productCount: count,
			}
		})

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: {
					total: allProducts.length,
					categories: preparedData,
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
