import Cart from '@/models/Cart'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		let cart = new Cart(data)

		if (!data.user) {
			await cart.genSessionToken()
			cart.save()
		}

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: cart,
			}),
			{ status: 201 }
		)
	} catch (error) {
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
