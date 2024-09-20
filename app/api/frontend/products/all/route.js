import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const products = await Product.find({ isActive: true })
			.collation({ locale: 'en' })
			// .populate({
			// 	path: 'brand',
			// 	model: 'Brand',
			// 	select: 'name',
			// })
			// .populate({
			// 	path: 'category',
			// 	model: 'Category',
			// 	select: 'name parent',
			// 	populate: {
			// 		path: 'parent',
			// 		select: 'name parent',
			// 		populate: {
			// 			path: 'parent',
			// 			select: 'name parent',
			// 			populate: {
			// 				path: 'parent',
			// 				select: 'name',
			// 			},
			// 		},
			// 	},
			// })
			.select(
				'title slug brand sellPrice resellerPrice images countInStock category unitsSold rating onSale featured discount isActive createdAt'
			)
			.lean({ autopopulate: true })

		const count = await Product.count()

		return new Response(
			JSON.stringify({
				products,
				count,
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
