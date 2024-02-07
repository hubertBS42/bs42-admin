import Blog from '@/models/Blog'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newBlog = await Blog.create(data)

		if (!newBlog) throw new Error('Failed to create blog')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newBlog,
			}),
			{ status: 201 }
		)
	} catch (error) {
		return new NextResponse(
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
