import Currency from '@/models/Currency'
import Rate from '@/models/Rate'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const currency = await Currency.findOne({ isActive: true }).lean()

		let rate

		if (currency.isCustomRate) {
			rate = currency.customRate
		} else {
			rate = await Rate.findOne({ currency })
				.sort({ createdAt: -1 })
				.limit(1)
		}

		return new Response(
			JSON.stringify({
				rate: rate.rate,
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
