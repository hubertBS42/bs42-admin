import Role from '@/models/Role'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newRole = await Role.create(data)

		if (!newRole) throw new Error('Failed to create role.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newRole,
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
