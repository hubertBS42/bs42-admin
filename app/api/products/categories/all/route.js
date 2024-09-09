import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const categories = await Category.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('name slug parent images isActive')
			// .populate({
			// 	path: 'parent',
			// 	select: 'name parent',
			// 	populate: {
			// 		path: 'parent',
			// 		select: 'name parent',
			// 		populate: {
			// 			path: 'parent',
			// 			select: 'name',
			// 		},
			// 	},
			// })
			.lean({ autopopulate: true })

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: categories,
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
