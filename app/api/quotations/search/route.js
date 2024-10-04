import Quotation from '@/models/Quotation'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const quotations = await Quotation.find({
			$or: [
				{ quotationNumber: { $regex: query, $options: 'i' } },
				{ notes: { $regex: query, $options: 'i' } },
				{ 'contact.firstName': { $regex: query, $options: 'i' } },
				{ 'contact.lastName': { $regex: query, $options: 'i' } },
				{ 'contact.email': { $regex: query, $options: 'i' } },
				{ 'contact.phone': { $regex: query, $options: 'i' } },
			],
		})
			.sort({ createdAt: 'desc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: quotations,
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
