import InventoryOrder from '@/models/InventoryOrder'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const inventoryOrder = await InventoryOrder.findOne({
			orderNumber: params.number,
		})
			.populate({ path: 'user' })
			.populate({ path: 'supplier' })
			.lean()

		if (inventoryOrder) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: inventoryOrder,
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

		let inventoryOrder = await InventoryOrder.findOne({
			orderNumber: params.number,
		})

		updates.forEach(update => (inventoryOrder[update] = data[update]))

		await inventoryOrder.save()

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: inventoryOrder,
				message: 'Inventory order updated successfully.',
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
	try {
		await connectToDB()

		await InventoryOrder.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Inventory order was deleted successfully.',
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
