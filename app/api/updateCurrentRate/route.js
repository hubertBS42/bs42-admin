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
			`https://openexchangerates.org/api/latest.json?app_id=a2e14f92bd4447dfb27a4c43234cacd8&base=${abbreviation}`,
			{ cache: 'no-store' }
		)

		const data = await Currency.findById(id)

		data.history.unshift({ rate: rates.GHS })

		await data.save()

		if (!settings[0].exchangeRate.manualOverride) {
			const newSetting = {
				carouselSlides: settings[0].carouselSlides,
				exchangeRate: {
					currency: settings[0].exchangeRate.currency,
					currentRate: rates.GHS,
					manualOverride: settings[0].exchangeRate.manualOverride,
				},
			}

			await Setting.findByIdAndUpdate(settings[0]._id, newSetting)
		}

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
		sendMail({
			sender: {
				title: 'BS42.NET Alert',
				email: 'alert@bs42.net',
			},
			subject: 'System Error',
			toEmail: newUser.email,
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
