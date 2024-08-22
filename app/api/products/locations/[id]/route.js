import Location from '@/models/Location'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const location = await Location.findByIdAndUpdate(params.id, data, {
			new: true,
		})
			.select('_id')
			.lean()

		if (location) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: location,
					message: 'Location updated successfully.',
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

		const products = await Product.find({ location: params.id })

		const queries = []

		products.forEach(product => {
			queries.push(
				Product.findByIdAndUpdate(product._id, { location: null })
			)
		})

		queries.push(Location.findByIdAndDelete(params.id))

		await Promise.all(queries)

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
