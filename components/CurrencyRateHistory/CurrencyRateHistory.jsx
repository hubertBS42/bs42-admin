'use client'
import { filterRatesByDateRange } from '@/utils/functions'
import {
	Chart as ChartJS,
	LineElement,
	TimeScale, //time scale
	LinearScale, //y
	PointElement,
	Tooltip,
	Legend,
} from 'chart.js'

import 'chartjs-adapter-date-fns'
import { format, subDays } from 'date-fns'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { DateRangePicker, Stack } from 'rsuite'

ChartJS.register(
	LineElement,
	TimeScale,
	LinearScale, //y
	PointElement,
	Tooltip,
	Legend
)

const CurrencyRateHistory = ({ currencyData }) => {
	const last7DaysStart = subDays(new Date(), 6) // Start of last 7 days
	const last7DaysEnd = new Date() // End of last 7 days (today)

	const [dateRange, setDateRange] = useState([
		last7DaysStart,
		last7DaysEnd,
	])

	const rateHistory = currencyData.history.map(data => {
		return { date: data.timestamp, rate: data.rate }
	})

	const filteredRates = filterRatesByDateRange(
		rateHistory,
		dateRange[0],
		dateRange[1]
	)

	const dates = filteredRates.map(data => data.date)
	const rates = filteredRates.map(data => data.rate)

	const data = {
		labels: dates,
		datasets: [
			{
				label: 'Exhange Rate',
				data: rates,
				backgroundColor: 'aqua',
				borderColor: 'white',
				tension: 0.4,
			},
		],
	}

	const options = {
		responsive: true,
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'day',
				},
			},
		},
	}

	return (
		<>
			<Stack justifyContent='space-between' alignItems='center'>
				<Stack spacing={10}>
					<span>Currency:</span>
					{currencyData.abbreviation} ({currencyData.symbol})
				</Stack>

				<Stack spacing={10}>
					<span>Current Rate:</span>
					{currencyData.history.length > 0
						? currencyData.history[0].rate
						: 'N/A'}
				</Stack>

				<Stack spacing={10}>
					Period:
					<DateRangePicker
						showHeader={false}
						value={dateRange}
						onChange={setDateRange}
						cleanable={false}
					/>
				</Stack>
			</Stack>
			<Line data={data} options={options}></Line>
		</>
	)
}
export default CurrencyRateHistory
