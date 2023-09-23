import Setting from '@/models/Setting'
import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'
import { fetcher } from '@/utils/functions'
import { sendMail } from '@/utils/mailer'

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
		const currency = settings[0].exchangeRate.currency
		const abbreviation = currency.abbreviation
		const id = currency._id

		const { rates } = await fetcher(
			`https://openexchangerates.org/api/latest.json?app_id=a2e14f92bd4447dfb27a4c43234cacd8&base=${abbreviation}`
		)

		const data = await Currency.findById(id)

		data.history.unshift({ rate: rates.GHS })

		await data.save()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: 'Currency rate was updated successfully',
			}),
			{
				status: 200,
			}
		)
	} catch (error) {
		sendMail(
			'BS42.NET CURRENCY RATE',
			'hubert@attelecomms.co.uk',
			'Scheduled task to update currency rate has failed.'
		)
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
