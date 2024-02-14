import Blog from '@/models/Blog'
import User from '@/models/User'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	const { slug } = params
	try {
		await connectToDB()

		const blog = await Blog.findOne({ slug })
			.populate({
				path: 'author',
				model: 'User',
				select: 'firstName lastName',
			})
			.lean()

		if (!blog) {
			return new NextResponse(
				JSON.stringify({
					status: 'failed',
					data: null,
					message: 'Blog not found.',
				}),
				{ status: 404 }
			)
		}

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: blog,
				message: null,
			}),
			{ status: 200 }
		)
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}
