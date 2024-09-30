'use client'
import { fetcher, filterRates } from '@/utils/functions'
// import {
// 	Chart as ChartJS,
// 	LineElement,
// 	TimeScale, //time scale
// 	LinearScale, //y
// 	PointElement,
// 	Tooltip,
// 	Legend,
// } from 'chart.js'

// import 'chartjs-adapter-date-fns'
import { subDays } from 'date-fns'
import { useEffect, useState } from 'react'
// import { Line } from 'react-chartjs-2'
import { toast } from 'react-toastify'
import { DateRangePicker, Loader, Stack } from 'rsuite'
import dynamic from 'next/dynamic'
const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

// ChartJS.register(
// 	LineElement,
// 	TimeScale,
// 	LinearScale, //y
// 	PointElement,
// 	Tooltip,
// 	Legend
// )

const CurrencyRateHistory = ({ currency }) => {
	const last7DaysStart = subDays(new Date(), 6) // Start of last 7 days
	const last7DaysEnd = new Date() // End of last 7 days (today)
	const [history, setHistory] = useState([])
	const [currentRate, setCurrentRate] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [options, setOptions] = useState({
		chart: {
			id: 'basic-line',
			zoom: {
				enabled: false,
			},
		},
		tooltip: {
			theme: 'dark', // Use 'light' or 'dark' theme for tooltip
			// x: {
			// 	format: 'dd MMM yyyy HH:mm', // Customize the format for date and time
			// },
			// style: {
			// 	fontSize: '14px',
			// 	fontFamily: 'Arial',
			// 	colors: ['#FF5733'], // Customize the text color inside the tooltip
			// },
		},
		xaxis: {
			type: 'datetime',
			categories: [],
			labels: {
				style: {
					colors: 'white',
				},
			},
			title: {
				text: 'Dates',
				style: {
					color: 'white',
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: 'white',
				},
			},
			title: {
				text: 'Rates',
				style: {
					color: 'white',
				},
			},
		},
	})
	const [series, setSeries] = useState([])

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

			const dates = filteredHistory.map(data => data.createdAt)
			const rates = filteredHistory.map(data => data.rate)

			setOptions(prev => ({
				...prev,
				xaxis: {
					...prev.xaxis,
					categories: dates,
					// min: dateRange[0].getTime(),
					// max: dateRange[1].getTime(),
				},
			}))

			setSeries(prev => {
				const data = { name: 'Dollar to GHS rate', data: rates }
				return [data]
			})

			// setHistory(filteredHistory)
			setCurrentRate(currentRate)
		}

		loadHistory()
	}, [dateRange, currency])

	// const dates = history.map(data => data.createdAt)
	// const rates = history.map(data => data.rate)

	// const data = {
	// 	labels: dates,
	// 	datasets: [
	// 		{
	// 			label: 'Exhange Rate',
	// 			data: rates,
	// 			backgroundColor: 'aqua',
	// 			borderColor: 'white',
	// 			tension: 0.4,
	// 		},
	// 	],
	// }

	// const options = {
	// 	responsive: true,
	// 	scales: {
	// 		x: {
	// 			type: 'time',
	// 			time: {
	// 				unit: 'day',
	// 			},
	// 		},
	// 	},
	// }

	return (
		<>
			<Stack
				justifyContent='space-between'
				alignItems='center'
				style={{ marginBottom: '2em' }}
			>
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

			<ApexChart
				options={options}
				series={series}
				type='line'
				width='100%'
				height={400}
			/>

			{/* <Line data={data} options={options}></Line> */}

			{isLoading && <Loader center content='loading' />}
		</>
	)
}
export default CurrencyRateHistory
