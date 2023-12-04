import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const products = await Product.find({
			title: { $regex: queryRegx },
		})
			.sort({ title: 'asc' })
			.populate({
				path: 'brand',
				model: 'Brand',
				select: 'name slug',
			})
			// .populate({
			// 	path: 'category',
			// 	model: 'Category',
			// 	select: 'name slug',
			// })
			.select('title slug brand images category isActive createdAt')
			.lean()

		return new Response(
			JSON.stringify({
				products,
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
			{
				status: 500,
			}
		)
	}
}
