import Cart from '@/models/Cart'
import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const POST = async request => {
	const data = await request.json()
	const { searchParams } = new URL(request.url)
	let cartToken = searchParams.get('cartToken')
	let userID = searchParams.get('userID')

	cartToken = cartToken === 'null' ? null : cartToken
	userID = userID === 'null' ? null : userID

	try {
		await connectToDB()
		const newOrder = await Order.create(data)

		if (!newOrder) throw new Error('Failed to create order')

		if (cartToken) {
			jwt.verify(cartToken, 'abc123')
			await Cart.findOneAndDelete({ token: cartToken })
		}

		if (userID) {
			await Cart.findOneAndDelete({ user: userID })
		}

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
