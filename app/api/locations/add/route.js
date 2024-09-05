import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()
	let preparedData
	try {
		await connectToDB()
		const document = await Location.findOne({
			type: 'facility',
			default: true,
		})

		if (!document) {
			preparedData = { ...data, isDefault: true }
		}

		if (document && data.isDefault) {
			await Location.findOneAndUpdate(
				{ isDefault: true },
				{ isDefault: false }
			)
			preparedData = data
		}

		if (document && !data.isDefault) {
			preparedData = data
		}

		const newLocation = await Location.create(preparedData)

		if (!newLocation) throw new Error('Failed to add location.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newLocation,
			}),
			{ status: 201 }
		)
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
