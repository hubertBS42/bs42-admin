import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	try {
		await connectToDB()

		const order = await Order.findOne({ orderNumber: params.id }).lean()

		if (order) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: order,
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

	try {
		await connectToDB()

		const order = await Order.findByIdAndUpdate(params.id, data, {
			new: true,
		})
			.select('_id')
			.lean()

		if (order) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: order,
					message: 'Order updated successfully.',
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

		await Order.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Order was deleted successfully.',
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
