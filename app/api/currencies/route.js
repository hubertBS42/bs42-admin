import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	try {
		await connectToDB()

		const currencies = await Currency.find()
			.collation({ locale: 'en' })
			.sort({ country: 'asc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: currencies,
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
