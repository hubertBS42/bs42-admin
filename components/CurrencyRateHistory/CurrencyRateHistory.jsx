'use client'
import { fetcher, filterRates } from '@/utils/functions'
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
import { subDays } from 'date-fns'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { toast } from 'react-toastify'
import { DateRangePicker, Loader, Stack } from 'rsuite'

ChartJS.register(
	LineElement,
	TimeScale,
	LinearScale, //y
	PointElement,
	Tooltip,
	Legend
)

const CurrencyRateHistory = ({ currency }) => {
	const last7DaysStart = subDays(new Date(), 6) // Start of last 7 days
	const last7DaysEnd = new Date() // End of last 7 days (today)
	const [history, setHistory] = useState([])
	const [currentRate, setCurrentRate] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const [dateRange, setDateRange] = useState([
		last7DaysStart,
		last7DaysEnd,
	])

	useEffect(() => {
		const loadHistory = async () => {
			setIsLoading(true)
			const {
				status,
				message,
				data: { currentRate, history },
			} = await fetcher(
				`/api/currencies/${currency._id}/history?start=${dateRange[0]}&end=${dateRange[1]}`
			)

			setIsLoading(false)
			if (status === 'error') return toast.error('Failed to load data.')

			const filteredHistory = filterRates(history)

			setHistory(filteredHistory)
			setCurrentRate(currentRate)
		}

		loadHistory()
	}, [dateRange, currency])

	const dates = history.map(data => data.createdAt)
	const rates = history.map(data => data.rate)

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
					{currency?.abbreviation} ({currency?.symbol})
				</Stack>

				<Stack spacing={10}>
					<span>Current Rate:</span>
					{currentRate
						? currentRate
						: isLoading
						? 'Loading...'
						: currentRate}
				</Stack>

				<Stack spacing={10}>
					Period:
					<DateRangePicker
						showHeader={false}
						value={dateRange}
						onChange={setDateRange}
						cleanable={false}
						disabled={isLoading}
					/>
				</Stack>
			</Stack>

			<Line data={data} options={options}></Line>

			{isLoading && <Loader center content='loading' />}
		</>
	)
}
export default CurrencyRateHistory
