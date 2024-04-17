import Invoice from '@/components/Invoice/Invoice'
import { renderToFile, renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'
import path from 'path'

export const POST = async request => {
	let data = await request.json()

	const root = path.resolve(process.cwd(), 'public')

	try {
		await renderToFile(<Invoice data={data} />, `${root}/my-doc.pdf`)
		// const stream = await renderToStream(<Invoice />)

		return new NextResponse(JSON.stringify({ status: 'success' }), {
			status: 201,
		})
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
