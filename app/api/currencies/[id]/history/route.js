import Rate from '@/models/Rate'
import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	const { searchParams } = new URL(request.url)
	const startDate = searchParams.get('start')
	const endDate = searchParams.get('end')

	const { id } = params

	try {
		await connectToDB()

		const historyQuery = Rate.find({
			currency: id,
			createdAt: {
				$gte: new Date(startDate).setHours(0, 0, 0),
				$lte: new Date(endDate).setHours(23, 59, 59),
			},
			// createdAt: { $gte: startDate, $lte: endDate },
		})
			.select('rate createdAt')
			.sort({ createdAt: 'desc' })
			.lean()

		const activeCurrencyQuery = Currency.findOne({
			isActive: true,
		}).lean()

		const [history, activeCurrency] = await Promise.all([
			historyQuery,
			activeCurrencyQuery,
		])

		let currentRate

		if (activeCurrency.isCustomRate) {
			currentRate = activeCurrency.customRate
		} else {
			currentRate = await Rate.findOne({ currency: id })
				.sort({ createdAt: -1 })
				.limit(1)
		}

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: { history, currentRate: currentRate.rate },
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
