import Cart from '@/models/Cart'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

//PATCH
export const PATCH = async request => {
	let data = await request.json()
	const { searchParams } = new URL(request.url)
	let token = searchParams.get('token')
	let userID = searchParams.get('userID')
	let cart
	token = token === 'null' ? null : token
	userID = userID === 'null' ? null : userID

	try {
		await connectToDB()
		if (userID) {
			cart = await Cart.findOneAndUpdate({ user: userID }, data)
			if (!cart) {
				cart = await Cart.create({ ...data, user: userID })
			}
		} else if (!userID && token) {
			const decoded = jwt.verify(token, 'abc123')

			cart = await Cart.findOneAndUpdate({ token }, data)
			if (!cart) {
				cart = new Cart(data)
				await cart.genSessionToken()
				cart.save()
			}
		} else {
			cart = new Cart(data)
			await cart.genSessionToken()
			cart.save()
		}

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: cart,
			}),
			{ status: 200 }
		)
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}
