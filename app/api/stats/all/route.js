import StockLevel from '@/models/StockLevel'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import Location from '@/models/Location'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import Currency from '@/models/Currency'
import { subDays } from 'date-fns'
import Rate from '@/models/Rate'
import Order from '@/models/Order'

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

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const currency = await Currency.findOne({ isActive: true }).lean()

		let rate

		if (currency.isCustomRate) {
			rate = currency.customRate
		} else {
			const document = await Rate.findOne({ currency })
				.sort({ createdAt: -1 })
				.limit(1)

			rate = document.rate
		}

		// PRODUCT CATEGORIES STATS
		const allCategoriesQuery = Category.find()
			// .select('name parent')
			.lean({
				autopopulate: false,
			})

		const allProductsQuery = Product.find({ isActive: true })
			.select('category')
			.lean({ autopopulate: false })

		const activeCurrencyQuery = Currency.findOne({
			isActive: true,
		})
			.select('_id')
			.lean()

		const recentOrdersQuery = Order.find({})
			.sort({ createdAt: 'desc' })
			.limit(5)
			.lean()

		const [allCategories, allProducts, activeCurrency, orders] =
			await Promise.all([
				allCategoriesQuery,
				allProductsQuery,
				activeCurrencyQuery,
				recentOrdersQuery,
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

		const categories = formattedCategories.map(category => {
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

		// CURRENCY RATE HISTORY
		const last30DaysStart = subDays(new Date(), 29) // Start of last 30 days
		const last30DaysEnd = new Date() // End of last 30 days (today)

		const history = await Rate.find({
			currency: activeCurrency._id,
			createdAt: {
				$gte: new Date(last30DaysStart).setHours(0, 0, 0),
				$lte: new Date(last30DaysEnd).setHours(23, 59, 59),
			},
		})
			.select('rate createdAt')
			.sort({ createdAt: 'desc' })
			.lean()

		// TOTAL SALES
		// Get the date 7 days ago from now
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		// Step 1: Fetch sales data for the last 7 days
		const sales = await Order.aggregate([
			{
				// Filter orders to only include those made in the last 7 days
				$match: {
					createdAt: { $gte: sevenDaysAgo },
				},
			},
			{
				// Group by day, using the 'createdAt' field
				$group: {
					_id: {
						$dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
					},
					totalSales: { $sum: '$total' }, // Summing up sales amount for the day
					rate: { $first: '$rate' },
					count: { $sum: 1 }, // Count the number of sales for the day
				},
			},
			{
				// Sort by the day (most recent first)
				$sort: { _id: 1 },
			},
		])

		// Step 2: Generate an array of the last 7 days
		const last7Days = []
		for (let i = 6; i >= 0; i--) {
			const day = new Date()
			day.setDate(day.getDate() - i)
			last7Days.push(day.toISOString().slice(0, 10)) // Format as 'YYYY-MM-DD'
		}

		// Step 3: Merge sales data with the generated 7 days
		const result = last7Days.map(day => {
			const sale = sales.find(sale => sale._id === day)
			return sale
				? sale
				: {
						_id: day,
						totalSales: 0,
						count: 0,
						rate: 0,
				  }
		})

		//TOP SELLERS
		const topSellingProducts = await Order.aggregate([
			{
				// Filter orders where the status array contains either "pickedup" or "delivered"
				$match: {
					'status.type': { $in: ['pickedUp', 'delivered'] },
				},
			},
			{
				// Unwind the array of products in each order
				$unwind: '$products',
			},
			{
				// Group by productId and calculate the total quantity sold for each product
				$group: {
					_id: '$products.productRef', // Group by productId
					totalQuantity: { $sum: '$products.quantity' }, // Sum the quantity sold
				},
			},
			{
				// Sort by totalQuantity in descending order to get top-selling products
				$sort: { totalQuantity: -1 },
			},
			{
				// Limit the results to the top N products
				$limit: 5,
			},
			{
				// Optionally, lookup the product details (e.g., name, price) from the products collection
				$lookup: {
					from: 'products', // Collection where product details are stored
					localField: '_id', // Field in the current collection
					foreignField: '_id', // Field in the products collection (assuming ObjectId type)
					as: 'productDetails',
				},
			},
			{
				// Optionally, format the output by unwinding the product details
				$unwind: '$productDetails',
			},
			{
				// Lookup the brand details from the Brand collection
				$lookup: {
					from: 'brands', // Brand collection name
					localField: 'productDetails.brand', // The 'brand' field in the Product schema (ObjectId)
					foreignField: '_id', // The '_id' field in the Brand collection
					as: 'brandDetails', // Output field name for the brand details
				},
			},
			{
				// Unwind the brand details to access the brand's name and other fields
				$unwind: '$brandDetails',
			},
			{
				// Lookup stock count from the stocklevels collection
				$lookup: {
					from: 'stocklevels', // Stock levels collection name
					localField: '_id', // _id from the product aggregation (productId)
					foreignField: 'product', // The 'productId' field in the stocklevels collection
					as: 'stockLevelDetails', // Output field name for the stock levels
				},
			},
			{
				// Unwind the stock level details to access the stock count
				$unwind: '$stockLevelDetails',
			},
			{
				// Optionally, project the fields you want to include in the result
				$project: {
					_id: 0, // Hide _id
					productId: '$_id',
					totalQuantity: 1,
					title: '$productDetails.title',
					category: '$productDetails.category',
					price: '$productDetails.sellPrice', // Include any other fields you need
					count: '$stockLevelDetails.count', // Include the brand name from the Brand collection
				},
			},
		])

		const preparedData = {
			products: {
				categories,
				topSellers: topSellingProducts,
			},
			currentRate: rate,
			allCategories,
			rateHistory: history,
			recentOrders: orders,
			weeklySales: result,
		}

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: preparedData,
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
