import Comment from '@/models/Comment'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const comment = await Comment.findOneAndUpdate(
			{ _id: params.id },
			data,
			{ new: true }
		)

		if (!comment) throw new Error('Failed to update comment.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Comment updated successfully.',
			}),
			{ status: 200 }
		)
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}

//DELETE
export const DELETE = async (request, { params }) => {
	try {
		await connectToDB()

		await Comment.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Comment was deleted successfully.',
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
