import User from '@/models/User'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()
	const updates = Object.keys(data)

	try {
		await connectToDB()

		let user = await User.findById(params.id)
		updates.forEach(update => (user[update] = data[update]))

		await user.save()

		if (user) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: user,
					message: 'User updated successfully.',
				}),
				{ status: 200 }
			)
		}
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

//DELETE
export const DELETE = async (request, { params }) => {
	try {
		await connectToDB()

		await User.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'User was deleted successfully.',
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
