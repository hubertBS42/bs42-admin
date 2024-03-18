import NotificationProfile from '@/models/Template'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const profile = await NotificationProfile.findByIdAndUpdate(
			params.id,
			data,
			{
				new: true,
			}
		)
			.select('_id')
			.lean()

		if (profile) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: profile,
					message: 'Notification profile has been updated successfully.',
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

		await NotificationProfile.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Notification profile was deleted successfully.',
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
