import Application from '@/models/Application'
import { connectToDB } from '@/utils/database'
import { configMailer, fetchTemplate } from '@/utils/mailer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	try {
		await connectToDB()
		const newApplication = await Application.create(data)

		if (!newApplication) throw new Error('Application process failed.')

		const template = await fetchTemplate(
			'account-application-submission'
		)

		const recipients = [
			{
				group: 'users',
				variables: { firstName: newApplication.firstName },
				toEmail: newApplication.email,
			},
			{
				group: 'admins',
				variables: null,
				toEmail: null,
			},
		]

		recipients.forEach(async group => {
			const { transporter, mailOptions } = await configMailer({
				group: group.group,
				variables: group.variables,
				toEmail: group.toEmail,
				template,
			})

			await transporter.sendMail(mailOptions)
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newApplication,
			}),
			{ status: 201 }
		)
	} catch (error) {
		return new NextResponse(
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
