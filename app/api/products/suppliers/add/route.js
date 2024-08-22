import Supplier from '@/models/Supplier'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newSupplier = await Supplier.create(data)

		if (!newSupplier) throw new Error('Failed to add supplier.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newSupplier,
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
