import Setting from '@/models/Setting'
import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	try {
		await connectToDB()

		const fetchSettingsQuery = Setting.find()
			.collation({ locale: 'en' })
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'exchangeRate.currency',
				model: 'Currency',
			})
			.lean()

		const fetchCurrenciesQuery = Currency.find()
			.collation({ locale: 'en' })
			.sort({ country: 'asc' })
			.lean()

		const [settings, currencies] = await Promise.all([
			fetchSettingsQuery,
			fetchCurrenciesQuery,
		])

		const data = {
			settings,
			currencies,
		}

		return new Response(JSON.stringify(data), {
			status: 200,
		})
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
