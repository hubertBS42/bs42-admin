import Template from '@/models/Template'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const POST = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const template = await Template.create(data)

		if (template) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message: null,
					data: template,
				}),
				{ status: 201 }
			)
		}
	} catch (error) {
		console.log(error)
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
