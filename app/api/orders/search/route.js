import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const orders = await Order.find({
			$or: [
				{ orderNumber: { $regex: query, $options: 'i' } },
				{ status: { $regex: query, $options: 'i' } },
				{ notes: { $regex: query, $options: 'i' } },
				{ 'customerInfo.firstName': { $regex: query, $options: 'i' } },
				{ 'customerInfo.lastName': { $regex: query, $options: 'i' } },
				{ 'customerInfo.email': { $regex: query, $options: 'i' } },
				{ 'customerInfo.phone': { $regex: query, $options: 'i' } },
			],
		})
			.sort({ createdAt: 'desc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: orders,
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
