import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const currencies = await Currency.find({
			$or: [
				{ name: { $regex: query, $options: 'i' } },
				{ country: { $regex: query, $options: 'i' } },
				{ symbol: { $regex: query, $options: 'i' } },
				{ abbreviation: { $regex: query, $options: 'i' } },
			],
		})
			.sort({ createdAt: 'desc' })
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
			{
				status: 500,
			}
		)
	}
}
