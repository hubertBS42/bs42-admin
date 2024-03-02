import Server from '@/models/Server'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//POST
export const POST = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const server = await Server.create(data)

		if (server) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message: null,
					data: server,
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
