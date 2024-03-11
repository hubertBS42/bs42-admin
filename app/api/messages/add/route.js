import Message from '@/models/Message'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import { configMailer, fetchProfile } from '@/utils/mailer'

//POST
export const POST = async (request, { params }) => {
	const {
		subject,
		body,
		firstName,
		lastName,
		email,
		phone,
		companyName,
	} = await request.json()

	try {
		await connectToDB()

		const message = await Message.create({
			subject,
			body,
			sender: {
				firstName,
				lastName,
				email,
				phone,
				companyName,
			},
		})

		if (message) {
			const profile = await fetchProfile('contact-us')

			const { transporter, mailOptions } = await configMailer({
				variables: { firstName: message.sender.firstName },
				group: 'admins',
				profile,
			})

			await transporter.sendMail(mailOptions)

			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message:
						'Thank you, we have successfully received your message. You will be contacted soon by a staff member.',
					data: message,
				}),
				{ status: 201 }
			)
		}
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message:
					'Sorry, your message was not received due to some kind of error. Try refreshing the page and try again. If the problem persists, you can contact us via email.',
				data: null,
			}),
			{
				status: 500,
			}
		)
	}
}
