import Location from '@/models/Location'
import { connectToDB } from '@/utils/database'
import { getPopulatedDocs } from '@/utils/functions'
import { NextResponse } from 'next/server'

//GET
export const GET = async (request, { params }) => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const storage = await Location.find({
			type: { $in: ['section', 'aisle', 'shelf', 'slot'] },
		})

		// const storage = await getPopulatedDocs(docs)

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: storage,
				message: null,
			}),
			{ status: 200 }
		)
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}
