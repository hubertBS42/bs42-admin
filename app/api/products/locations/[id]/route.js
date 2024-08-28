import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()
	const updates = Object.keys(data)

	try {
		await connectToDB()

		if (data.isDefault) {
			await Location.findOneAndUpdate(
				{ isDefault: true },
				{ isDefault: false }
			)
		}

		let location = await Location.findById(params.id)
		updates.forEach(update => (location[update] = data[update]))

		await location.save()

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Location updated successfully.',
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

		await Location.findByIdAndDelete(params.id)

		const lastAddedLocation = await Location.findOne().sort({
			createdAt: -1,
		})

		if (lastAddedLocation) {
			lastAddedLocation.isDefault = true
			await lastAddedLocation.save()
		}

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Location was deleted successfully.',
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
