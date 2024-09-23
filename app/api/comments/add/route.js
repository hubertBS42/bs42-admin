import Comment from '@/models/Comment'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()

		const newComment = await Comment.create(data)

		if (!newComment) throw new Error('Failed to add comment.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newComment,
			}),
			{ status: 201 }
		)
	} catch (error) {
		console.log(error)
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
