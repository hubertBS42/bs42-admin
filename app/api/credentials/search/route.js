import Credential from '@/models/Credential'
import Server from '@/models/Server'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	const query = searchParams.get('q')

	try {
		await connectToDB()

		const queryRegx = new RegExp(query, 'i')

		const credentials = await Credential.find({
			$or: [
				{ label: { $regex: queryRegx } },
				{ user: { $regex: queryRegx } },
				{ description: { $regex: queryRegx } },
			],
		})
			.sort({ createdAt: 'desc' })
			.populate({
				path: 'server',
				model: 'Server',
			})
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
			{
				status: 500,
			}
		)
	}
}
