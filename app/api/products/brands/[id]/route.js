import Brand from '@/models/Brand'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const brand = await Brand.findByIdAndUpdate(params.id, data, {
			new: true,
		})
			.select('_id')
			.lean()

		if (brand) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: brand,
					message: 'Brand updated successfully.',
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

		const products = await Product.find(
			{ brand: params.id },
			{},
			{ autopopulate: false }
		)

		const queries = []

		products.forEach(product => {
			queries.push(
				Product.findByIdAndUpdate(product._id, { brand: null })
			)
		})

		queries.push(Brand.findByIdAndDelete(params.id))

		await Promise.all(queries)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Brand was deleted successfully.',
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
