import Project from '@/models/Project'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

export const POST = async request => {
	const data = await request.json()

	try {
		await connectToDB()
		const newProject = await Project.create(data)

		if (!newProject) throw new Error('Failed to add project.')

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newProject,
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
