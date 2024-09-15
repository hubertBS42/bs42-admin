import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import StockLevel from '@/models/StockLevel'
import { connectToDB } from '@/utils/database'
import { fetchTemplate } from '@/utils/mailer'
import { hydrateMessage } from '@/utils/functions'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const template = await fetchTemplate('low-stock')
		const stockLevels = await StockLevel.find()
			.sort({ createdAt: -1 })
			.limit(2)
			.populate({
				path: 'product',
			})

		const products = stockLevels.map(item => item.product.title)
		const message = template.admins.message

		const hydratedMessage = hydrateMessage(template.admins.message, {
			items: products,
		})

		console.log(hydratedMessage)

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: hydratedMessage,
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
