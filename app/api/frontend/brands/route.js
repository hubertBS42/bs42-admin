import Brand from '@/models/Brand'
import { connectToDB } from '@/utils/database'

export const GET = async request => {
	const { searchParams } = new URL(request.url)
	try {
		await connectToDB()

		const brands = await Brand.find()
			.collation({ locale: 'en' })
			.sort({ name: 'asc' })
			.select('-description -updatedAt')
			.lean()

		return new Response(
			JSON.stringify({
				brands,
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
