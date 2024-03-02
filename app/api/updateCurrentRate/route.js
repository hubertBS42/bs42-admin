import Currency from '@/models/Currency'
import { connectToDB } from '@/utils/database'
import { fetcher } from '@/utils/functions'
import { sendMail } from '@/utils/mailer'
import { format } from 'date-fns'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	const currencyId =
		searchParams.get('currency') === 'null'
			? null
			: searchParams.get('currency')

	try {
		await connectToDB()

		let currency

		if (currencyId) {
			currency = await Currency.findById(currencyId)
		} else {
			currency = await Currency.findOne({ isActive: true })
		}
		const abbreviation = currency.abbreviation

		const { rates } = await fetcher(
			`https://openexchangerates.org/api/latest.json?app_id=a2e14f92bd4447dfb27a4c43234cacd8&base=${abbreviation}`,
			{ cache: 'no-store' }
		)

		const date = Date.now()

		const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss')

		currency.history.unshift({ rate: rates.GHS })

		await currency.save()

		return new Response(
			JSON.stringify({
				status: 'success',
				data: { rate: rates.GHS, date: formattedDate },
				message: 'Currency rate was updated successfully',
			}),
			{
				status: 200,
			}
		)
	} catch (error) {
		sendMail({
			sender: {
				title: 'BS42.NET Alert',
				email: 'alert@bs42.net',
			},
			subject: 'System Error',
			toEmail: 'hubert@attelecomms.co.uk',
			message: `The scheduled task to update the system's currency rate has failed for the following reason;

				${error.message}
				`,
		})

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
