import Invoice from '@/components/Invoice/Invoice'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	try {
		const stream = await renderToStream(<Invoice />)

		return new NextResponse(stream, { status: 201 })
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
