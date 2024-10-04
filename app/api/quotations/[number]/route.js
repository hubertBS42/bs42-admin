import Quotation from '@/models/Quotation'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const quotation = await Quotation.findOne({
			quotationNumber: params.number,
		}).lean()

		if (quotation) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: quotation,
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

		let quotation = await Quotation.findOne({
			quotationNumber: params.number,
		})

		updates.forEach(update => (quotation[update] = data[update]))

		await quotation.save()

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: quotation,
				message: 'Quotation updated successfully.',
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

		await Quotation.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Quotation was deleted successfully.',
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
