import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import { findAncestors } from '@/utils/functions'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const allCategories = await Category.find().lean()

		const filteredCategories = await Category.find({
			$or: [{ name: { $regex: queryRegx } }],
		})
			.sort({ createdAt: 'desc' })
			// .populate({
			// 	path: 'parent',
			// 	model: 'Category',
			// 	select: 'name',
			// })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: {
					filtered: filteredCategories,
					all: allCategories,
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
			{
				status: 500,
			}
		)
	}
}
