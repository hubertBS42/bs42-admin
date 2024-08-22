import Supplier from '@/models/Supplier'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const supplier = await Supplier.findByIdAndUpdate(params.id, data, {
			new: true,
		})
			.select('_id')
			.lean()

		if (supplier) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: supplier,
					message: 'Supplier updated successfully.',
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

		const products = await Product.find({ supplier: params.id })

		const queries = []

		products.forEach(product => {
			queries.push(
				Product.findByIdAndUpdate(product._id, { supplier: null })
			)
		})

		queries.push(Supplier.findByIdAndDelete(params.id))

		await Promise.all(queries)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Supplier was deleted successfully.',
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
