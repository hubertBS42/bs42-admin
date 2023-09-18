import Rate from '@/models/Rate'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	try {
		await connectToDB()

		const rates = await Rate.find().lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: rates,
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
