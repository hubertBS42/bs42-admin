import Product from '@/models/Product'
import Category from '@/models/Category'
import Location from '@/models/Location'
import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import Inventory from '@/models/Inventory'

//GET
export const GET = async (request, { params }) => {
	const { slug } = params
	try {
		await connectToDB()

		let product = await Product.findOne({ slug })
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

		const inventory = await Inventory.find({
			product: product._id,
		}).populate({ path: 'location', model: 'Location' })

		console.log(inventory)

		if (inventory.length > 0) {
			product = { ...product.toObject(), inventory }
		} else {
			product = { ...product.toObject(), inventory: [] }
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
