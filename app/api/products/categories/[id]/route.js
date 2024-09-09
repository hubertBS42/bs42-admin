import Category from '@/models/Category'
import Product from '@/models/Product'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const GET = async (request, { params }) => {
	try {
		await connectToDB()

		const category = await Category.findById(params.id)
			.collation({ locale: 'en' })
			.lean({ autopopulate: false })

		if (!category) {
			return new Response(
				JSON.stringify({
					status: 'failed',
					message: 'Category not found.',
					data: null,
				}),
				{
					status: 404,
				}
			)
		}

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: category,
			}),
			{
				status: 200,
			}
		)
	} catch (error) {
		console.log(error)
		return new Response(
			JSON.stringify({
				status: 'error',
				message: error.message,
				data: null,
			}),
			{ status: 500 }
		)
	}
}

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const category = await Category.findByIdAndUpdate(params.id, data, {
			new: true,
		})
			.select('_id')
			.lean({ autopopulate: false })

		if (category) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: category,
					message: 'Category updated successfully.',
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

		await Category.findByIdAndDelete(params.id)

		const childrenQuery = await Category.find(
			{ parent: params.id },
			{},
			{ autopopulate: false }
		)
		const productsQuery = await Product.find(
			{ category: params.id },
			{},
			{ autopopulate: false }
		)

		const [children, products] = await Promise.all([
			childrenQuery,
			productsQuery,
		])

		const updateQueries = []

		children.forEach(child => {
			updateQueries.push(
				Category.findByIdAndUpdate(child._id, { parent: null })
			)
		})

		products.forEach(product => {
			updateQueries.push(
				Product.findByIdAndUpdate(product._id, { category: null })
			)
		})

		await Promise.all(updateQueries)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Category was deleted successfully.',
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
