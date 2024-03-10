import User from '@/models/User'
import Application from '@/models/Application'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()
	const updates = Object.keys(data)

	try {
		await connectToDB()

		let application = await Application.findById(params.id)
		updates.forEach(update => (application[update] = data[update]))

		await application.save()

		if (application) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: application,
					message: 'Application has been updated successfully.',
				}),
				{ status: 200 }
			)
		}
	} catch (error) {
		console.log(error.message)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: 'Failed to update application.',
			}),
			{ status: 500 }
		)
	}
}
