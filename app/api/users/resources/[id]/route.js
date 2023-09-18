import Resource from '@/models/Resource'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const resource = await Resource.findByIdAndUpdate(params.id, data, {
			new: true,
		})
			.select('_id')
			.lean()

		if (resource) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: resource,
					message: 'Resource updated successfully.',
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

		await Resource.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Resource was deleted successfully.',
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
