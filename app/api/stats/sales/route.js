import Currency from '@/models/Currency'
import Order from '@/models/Order'
import { connectToDB } from '@/utils/database'
import { NextResponse } from 'next/server'

//GET
export const GET = async request => {
	const { searchParams } = new URL(request.url)
	let startDate = searchParams.get('start')
	let endDate = searchParams.get('end')
	const start = new Date(startDate).setHours(0, 0, 0, 0)
	const end = new Date(endDate).setHours(23, 59, 59, 999)

	try {
		await connectToDB()

		// Step 1: Fetch sales data for the last 7 days
		const sales = await Order.aggregate([
			{
				// Filter orders to only include those made in the last 7 days
				$match: {
					createdAt: {
						$gte: new Date(start),
						$lte: new Date(end),
					},
					'status.type': { $in: ['pickedUp', 'delivered'] },
				},
			},
			{
				// Group by day, using the 'createdAt' field
				$group: {
					_id: {
						$dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
					},
					totalSales: { $sum: '$total' }, // Summing up sales amount for the day
					rate: { $first: '$rate' },
					count: { $sum: 1 }, // Count the number of sales for the day
				},
			},
			{
				// Sort by the day (most recent first)
				$sort: { _id: 1 },
			},
		])

		// Step 2: Generate an array of days
		// Get the time difference in milliseconds
		const differenceInTime = new Date(endDate) - new Date(startDate)

		// Convert time difference from milliseconds to days
		const differenceInDays = differenceInTime / (1000 * 3600 * 24)
		const days = []
		for (let i = differenceInDays; i >= 0; i--) {
			const formattedEndDate = new Date(endDate)
			formattedEndDate.setDate(formattedEndDate.getDate() - i)
			days.push(formattedEndDate.toISOString().slice(0, 10)) // Format as 'YYYY-MM-DD'
		}

		// Step 3: Merge sales data with the generated 7 days
		const result = days.map(day => {
			const sale = sales.find(sale => sale._id === day)
			return sale
				? sale
				: {
						_id: day,
						totalSales: 0,
						count: 0,
						rate: 0,
				  }
		})

		return new NextResponse(
			JSON.stringify({
				status: 'success',
				data: result,
			}),
			{ status: 200 }
		)
	} catch (error) {
		console.log(error)
		return new NextResponse(
			JSON.stringify({
				status: 'error',
				message: error.message,
			}),
			{ status: 500 }
		)
	}
}
