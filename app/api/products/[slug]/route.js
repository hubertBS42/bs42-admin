import Product from '@/models/Product'
import Category from '@/models/Category'
import Location from '@/models/Location'
import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import StockLevel from '@/models/StockLevel'

//GET
export const GET = async (request, { params }) => {
	const { slug } = params
	try {
		await connectToDB()

		const defaultLocationQuery = Location.findOne({
			isDefault: true,
			type: 'facility',
		})
			.select('_id')
			.lean({ autopopulate: false })

		const productQuery = Product.findOne({ slug }).lean({
			autopopulate: true,
		})

		let [defaultLocation, product] = await Promise.all([
			defaultLocationQuery,
			productQuery,
		])

		const stock = await StockLevel.findOne({
			product: product._id,
			location: defaultLocation,
		})
			.select('product count location sku')
			.lean({ autopopulate: false })

		const formattedProduct = {
			...product,
			count: stock?.count || 0,
			sku: stock?.sku || '',
		}

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
				product: formattedProduct,
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
			const stockEntries = await StockLevel.find({
				product: deleted._id,
			})

			if (stockEntries.length > 0) {
				stockEntries.forEach(async entry => {
					await StockLevel.findByIdAndDelete(entry._id)
				})
			}

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
