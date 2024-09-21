const fs = require('fs')
import { formatOrder } from '@/utils/functions'
import path from 'path'

export const GET = async request => {
	const { searchParams } = new URL(request.url)

	const root = path.resolve(process.cwd(), 'public')

	// Function to read, format, and write JSON data
	const formatJsonData = (
		inputFilePath,
		outputFilePath,
		formatFunction
	) => {
		// Step 1: Read the JSON file
		fs.readFile(inputFilePath, 'utf8', (err, data) => {
			if (err) {
				console.error(`Error reading file: ${err}`)
				return
			}

			// Step 2: Parse the JSON data
			let jsonData
			try {
				jsonData = JSON.parse(data)
			} catch (error) {
				console.error(`Error parsing JSON: ${error}`)
				return
			}

			// Step 3: Map through the data and apply formatting
			const formattedData = jsonData.map(formatFunction)

			// Step 4: Write the formatted data to a new JSON file
			fs.writeFile(
				outputFilePath,
				JSON.stringify(formattedData, null, 2),
				err => {
					if (err) {
						console.error(`Error writing file: ${err}`)
						return
					}
					console.log(
						`File has been written successfully to ${outputFilePath}`
					)
				}
			)
		})
	}

	try {
		const inputFilePath = `${root}/orders.json` // Path to the input JSON file
		const outputFilePath = `${root}/bs42.orders.json` // Path to the output JSON file

		// Call the function to format the JSON data and save it to a new file
		formatJsonData(inputFilePath, outputFilePath, formatOrder)

		return new Response(
			JSON.stringify({
				status: 'success',
				message: null,
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
