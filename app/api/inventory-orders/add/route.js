import InventoryOrder from '@/models/InventoryOrder'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import { generateRandomCode } from '@/utils/functions'

export const POST = async request => {
	const data = await request.json()
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const generateOrderNumber = async () => {
			let orderNumber = generateRandomCode()
			const orderNumberExists = await InventoryOrder.findOne({
				orderNumber,
			})
			if (orderNumberExists) return generateOrderNumber()
			return orderNumber
		}

		const orderNumber = await generateOrderNumber()

		const newOrder = await InventoryOrder.create({
			...data,
			orderNumber,
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newOrder,
			}),
			{ status: 201 }
		)
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
				data: null,
			}),
			{
				status: 500,
			}
		)
	}
}
