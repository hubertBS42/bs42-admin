import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()
	const { id } = params

	try {
		await connectToDB()

		const currency = await Currency.findById(id)

		for (const key in data) {
			if (Object.hasOwnProperty.call(data, key)) {
				currency[key] = data[key]
			}
		}

		await currency.save()

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: null,
				message: 'Currency was updated successfully.',
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

		const currency = await Currency.findById(params.id)

		if (currency.isActive)
			throw new Error(
				"This currency is currently set as system's default. You will need to assign another currency as the default before you can delete this currency."
			)

		await currency.deleteOne()

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Currency was deleted successfully.',
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
