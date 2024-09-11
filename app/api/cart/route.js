import Cart from '@/models/Cart'
import Product from '@/models/Product'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import { connectToDB } from '@/utils/database'
import jwt from 'jsonwebtoken'
import { combineCartItems } from '@/utils/functions'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	let cartToken = searchParams.get('cartToken')
	let userID = searchParams.get('userID')

	cartToken = cartToken === 'null' ? null : cartToken
	userID = userID === 'null' ? null : userID
	let data

	try {
		await connectToDB()

		if (!userID && cartToken) {
			jwt.verify(cartToken, 'abc123')
			const guestCart = await Cart.findOne({ token: cartToken }).select(
				'items user token'
			)
			// .populate({
			// 	path: 'items.product',
			// 	model: 'Product',
			// 	select:
			// 		'images title brand category sellPrice countInStock slug',
			// 	populate: [
			// 		{
			// 			path: 'brand',
			// 		},
			// 		{
			// 			path: 'category',
			// 			select: 'name parent',
			// 			populate: {
			// 				path: 'parent',
			// 				select: 'name parent',
			// 				populate: {
			// 					path: 'parent',
			// 					select: 'name parent',
			// 					populate: {
			// 						path: 'parent',
			// 						select: 'name',
			// 					},
			// 				},
			// 			},
			// 		},
			// 	],
			// })

			if (!guestCart)
				throw new Error('A cart belonging to this guest does not exist.')
			data = guestCart
		}

		if (userID && !cartToken) {
			const userCart = await Cart.findOne({ user: userID }).select(
				'items user token'
			)
			// .populate({
			// 	path: 'items.product',
			// 	model: 'Product',
			// 	select:
			// 		'images title brand category sellPrice countInStock slug',
			// 	populate: [
			// 		{
			// 			path: 'brand',
			// 		},
			// 		{
			// 			path: 'category',
			// 			populate: {
			// 				path: 'parent',
			// 				populate: {
			// 					path: 'parent',
			// 					populate: {
			// 						path: 'parent',
			// 					},
			// 				},
			// 			},
			// 		},
			// 	],
			// })

			data = userCart
		}

		if (userID && cartToken) {
			const userCart = await Cart.findOne({ user: userID }).select(
				'items user token'
			)
			// .populate({
			// 	path: 'items.product',
			// 	model: 'Product',
			// 	select:
			// 		'images title brand category sellPrice countInStock slug',
			// 	populate: [
			// 		{
			// 			path: 'brand',
			// 		},
			// 		{
			// 			path: 'category',
			// 			populate: {
			// 				path: 'parent',
			// 				populate: {
			// 					path: 'parent',
			// 					populate: {
			// 						path: 'parent',
			// 					},
			// 				},
			// 			},
			// 		},
			// 	],
			// })

			const guestCart = await Cart.findOne({ token: cartToken }).select(
				'items user token'
			)
			// .populate({
			// 	path: 'items.product',
			// 	model: 'Product',
			// 	select:
			// 		'images title brand category sellPrice countInStock slug',
			// 	populate: [
			// 		{
			// 			path: 'brand',
			// 		},
			// 		{
			// 			path: 'category',
			// 			populate: {
			// 				path: 'parent',
			// 				populate: {
			// 					path: 'parent',
			// 					populate: {
			// 						path: 'parent',
			// 					},
			// 				},
			// 			},
			// 		},
			// 	],
			// })

			if (!guestCart)
				throw new Error('A cart belonging to this guest does not exist.')

			const userCartItems = userCart?.items || []
			const guestCartItems = guestCart.items

			const updatedItems = combineCartItems(
				userCartItems,
				guestCartItems
			)

			if (userCart) await userCart.deleteOne()
			guestCart.items = updatedItems
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
