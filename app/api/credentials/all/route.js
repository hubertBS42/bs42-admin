import Credential from '@/models/Credential'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const credentials = await Credential.find()
			.sort({ label: 'asc' })
			.lean()

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
				data: credentials,
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
