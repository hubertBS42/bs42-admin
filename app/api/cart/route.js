import Cart from '@/models/Cart'
import Product from '@/models/Product'
import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'
import jwt from 'jsonwebtoken'
import { combineCartItems } from '@/utils/functions'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	let token = searchParams.get('token')
	let userID = searchParams.get('userID')
	let data
	let userCart = null
	let guestCart = null
	token = token === 'null' ? null : token
	userID = userID === 'null' ? null : userID

	try {
		await connectToDB()

		if (userID) {
			userCart = await Cart.findOne({ user: userID })
				.select('items user')
				.populate({
					path: 'items.product',
					model: 'Product',
					select: 'images title brand sellPrice',
					populate: {
						path: 'brand',
					},
				})
		}

		if (token) {
			const decoded = jwt.verify(token, 'abc123')
			guestCart = await Cart.findOne({ token })
				.select('items user')
				.populate({
					path: 'items.product',
					model: 'Product',
					select: 'images title brand sellPrice',
					populate: {
						path: 'brand',
					},
				})
		}

		if (userCart && guestCart) {
			const userCartItems = userCart.items
			const guestCartItems = guestCart.items

			const updatedItems = combineCartItems(
				userCartItems,
				guestCartItems
			)

			userCart.items = updatedItems
			const saved = await userCart.save()
			await guestCart.deleteOne()
			data = saved
		} else if (userCart && !guestCart) {
			data = userCart
		} else if (!userCart && guestCart) {
			guestCart.user = userID
			guestCart.token = null
			const saved = await guestCart.save()
			data = saved
		}

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data,
			}),
			{
				status: 200,
			}
		)
	} catch (error) {
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
