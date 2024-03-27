import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const currency = await Currency.findOne({ isActive: true }).lean()

		const rate = currency.isCustomRate
			? currency.customRate
			: currency.history[0].rate

		return new Response(
			JSON.stringify({
				rate,
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
