import Setting from '@/models/Setting'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const setting = await Setting.create(data)

		if (setting) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message: null,
					data: setting,
				}),
				{ status: 201 }
			)
		}
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
