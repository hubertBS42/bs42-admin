import User from '@/models/User'
import Blog from '@/models/Blog'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query =
		searchParams.get('q') === 'null' ? null : searchParams.get('q')
	const author =
		searchParams.get('author') === 'null'
			? null
			: searchParams.get('author')
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 25
	const sortBy = searchParams.get('sortBy') || 'newest'
	const startDate =
		searchParams.get('startDate') === 'null'
			? null
			: searchParams.get('startDate')
	const endDate =
		searchParams.get('endDate') === 'null'
			? null
			: searchParams.get('endDate')

	let field
	let order

	switch (sortBy) {
		case 'newest':
			field = 'createdAt'
			order = 'desc'
			break
		case 'a-z':
			field = 'title'
			order = 'asc'
			break
		case 'z-a':
			field = 'title'
			order = 'desc'
			break

		default:
			field = 'createdAt'
			order = 'desc'
			break
	}

	let blogsQuery = { isActive: true }

	try {
		await connectToDB()

		if (query) {
			blogsQuery.$or = [
				{ title: { $regex: query, $options: 'i' } },
				{ excerpt: { $regex: query, $options: 'i' } },
				{ tags: { $elemMatch: { $regex: query, $options: 'i' } } },
			]
		}

		if (author && author !== 'all') blogsQuery.author = author

		if (startDate && endDate) {
			const nextDay = new Date(endDate)
			nextDay.setDate(nextDay.getDate() + 1)
			blogsQuery.createdAt = {
				$gte: new Date(startDate),
				$lt: new Date(nextDay),
			}
		}

		const fetchBlogsQuery = Blog.find(blogsQuery)
			.collation({ locale: 'en' })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ [field]: order })
			.populate({
				path: 'author',
				model: 'User',
				select: 'firstName lastName',
			})
			.lean()

		const getCountQuery = Blog.count(blogsQuery)

		const [blogs, count] = await Promise.all([
			fetchBlogsQuery,
			getCountQuery,
		])

		return new Response(
			JSON.stringify({
				blogs,
				count,
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
