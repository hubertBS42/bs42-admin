import Setting from '@/models/Setting'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	try {
		await connectToDB()

		const settings = await Setting.find()
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'exchangeRate.currency',
				model: 'Currency',
			})
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: settings,
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
