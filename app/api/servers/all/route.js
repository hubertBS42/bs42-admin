import Server from '@/models/Server'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const servers = await Server.find().sort({ label: 'asc' }).lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: servers,
			}),
			{
				status: 200,
			}
		)
	} catch (error) {
		return new Response(
			JSON.stringify({
				status: 'error',
				message: error.message,
				data: null,
			}),
			{ status: 500 }
		)
	}
}
