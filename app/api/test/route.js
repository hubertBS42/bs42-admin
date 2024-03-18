import { connectToDB } from '@/utils/database'
import { configMailer, fetchTemplate } from '@/utils/mailer'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get('page') || 1
	const limit = searchParams.get('limit') || 10
	const sort = searchParams.get('sort') || 'desc'
	const field = searchParams.get('sortBy') || 'createdAt'

	try {
		await connectToDB()

		const profile = await fetchTemplate('contact-us')

		const { transporter, mailOptions } = await configMailer({
			variables: { firstName: 'Hubert' },
			group: 'admins',
			profile,
		})

		await transporter.sendMail(mailOptions)

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
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
