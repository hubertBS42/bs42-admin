import Credential from '@/models/Credential'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const POST = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const credential = await Credential.create(data)

		if (credential) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					message: null,
					data: credential,
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
