import Quotation from '@/models/Quotation'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'
import { generateRandomCode } from '@/utils/functions'

export const POST = async request => {
	const data = await request.json()
	const { searchParams } = new URL(request.url)

	try {
		await connectToDB()

		const generateQuotationNumber = async () => {
			let quotationNumber = generateRandomCode()
			const quotationNumberExists = await Quotation.findOne({
				quotationNumber,
			})
			if (quotationNumberExists) return generateQuotationNumber()
			return quotationNumber
		}

		const quotationNumber = await generateQuotationNumber()

		const newQuotation = await Quotation.create({
			...data,
			quotationNumber,
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				message: null,
				data: newQuotation,
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
