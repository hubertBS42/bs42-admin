import Product from '@/models/Product'
import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const products = await Product.find({
			$or: [{ title: { $regex: queryRegx } }],
		})
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'brand',
				model: 'Brand',
				select: 'name',
			})
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
