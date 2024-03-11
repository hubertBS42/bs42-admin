import Product from '@/models/Product'
import Category from '@/models/Category'
import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	const { slug } = params
	try {
		await connectToDB()

		const product = await Product.findOne({ slug })
			.populate({
				path: 'brand',
				model: 'Brand',
			})
			.populate({
				path: 'category',
				model: 'Category',
			})

		if (!product) {
			return new NextResponse(
				JSON.stringify({
					status: 'failed',
					data: null,
					message: 'Product not found.',
				}),
				{ status: 404 }
			)
		}

		return new NextResponse(
			JSON.stringify({
				product,
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

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()
	// const { shippingAndReturns, instructions, warranty } = data
	const { slug } = params

	try {
		await connectToDB()

		await Product.findOneAndUpdate({ slug }, data)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: null,
				message: 'Product was updated successfully.',
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

//DELETE
export const DELETE = async (request, { params }) => {
	const { slug } = params

	try {
		await connectToDB()

		const deleted = await Product.findOneAndDelete({ slug })

		if (deleted) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message: 'Product was deleted successfully.',
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
