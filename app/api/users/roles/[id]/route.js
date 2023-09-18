import Role from '@/models/Role'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//PATCH
export const PATCH = async (request, { params }) => {
	const data = await request.json()

	try {
		await connectToDB()

		const role = await Role.findByIdAndUpdate(params.id, data, {
			new: true,
		})
			.select('_id')
			.lean()

		if (role) {
			return new NextResponse(
				JSON.stringify({
					status: 'success',
					data: role,
					message: 'Role updated successfully.',
				}),
				{ status: 200 }
			)
		}
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}

//DELETE
export const DELETE = async (request, { params }) => {
	try {
		await connectToDB()

		await Role.findByIdAndDelete(params.id)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: 'Role was deleted successfully.',
			}),
			{ status: 200 }
		)
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}
