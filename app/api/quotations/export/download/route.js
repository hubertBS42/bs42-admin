import Quotation from '@/components/Quotation/Quotation'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'

export const POST = async request => {
	let data = await request.json()

	try {
		const stream = await renderToStream(<Quotation data={data} />)

		return new NextResponse(stream, {
			status: 201,
			headers: new Headers({
				// this optional header triggers a download in the browser
				'content-disposition': `attachment; filename=quotation_${data.quotationNumber}.pdf`,
				'content-type': 'application/pdf',
			}),
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
