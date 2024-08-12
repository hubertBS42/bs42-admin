import Project from '@/models/Project'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const projects = await Project.find({})
			.collation({ locale: 'en' })
			.lean()

		return new Response(JSON.stringify(projects), {
			status: 200,
		})
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
