import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'
import {
	findLocationDescendants,
	getPopulatedDocs,
} from '@/utils/functions'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const location = await Location.findById(params.id).lean()

		if (location) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: location,
					message: null,
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

		const ids = [params.id]

		const docs = await Location.find({
			type: { $in: ['section', 'aisle', 'shelf', 'slot'] },
		})

		const storageItems = await getPopulatedDocs(docs)

		const descendants = findLocationDescendants(storageItems, params.id)

		descendants.forEach(descendant =>
			ids.push(descendant._id.toString())
		)

		await Location.deleteMany({ _id: { $in: ids } })

		const lastAddedLocation = await Location.findOne({
			type: 'facility',
		}).sort({
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
