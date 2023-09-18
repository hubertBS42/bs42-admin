import Resource from '@/models/Resource'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newResource = await Resource.create(data)

		if (!newResource) throw new Error('Failed to create resource.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newResource,
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
