import Rate from '@/models/Rate'
import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const startDate = searchParams.get('start')
	const endDate = searchParams.get('end')

	try {
		await connectToDB()

		const activeCurrency = await Currency.findOne({ isActive: true })
			.select('_id')
			.lean()

		const history = await Rate.find({
			currency: activeCurrency._id,
			createdAt: {
				$gte: new Date(startDate).setHours(0, 0, 0),
				$lte: new Date(endDate).setHours(23, 59, 59),
			},
		})
			.select('rate createdAt')
			.sort({ createdAt: 'desc' })
			.lean()

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: history,
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
