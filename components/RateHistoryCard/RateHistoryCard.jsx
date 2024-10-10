'use client'
import { DateRangePicker, HStack, Panel, Text } from 'rsuite'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { fetcher, filterRates } from '@/utils/functions'
import { toast } from 'react-toastify'
import { subDays } from 'date-fns'
const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const RateHistoryCard = ({ data }) => {
	const last30DaysStart = subDays(new Date(), 29) // Start of last 30 days
	const last30DaysEnd = new Date() // End of last 30 days (today)

	const [dateRange, setDateRange] = useState([
		last30DaysStart,
		last30DaysEnd,
	])
	const [isLoading, setIsLoading] = useState(false)

	const loadRates = async input => {
		setIsLoading(true)
		setDateRange(input)

		const {
			status,
			message,
			data: currencyRates,
		} = await fetcher(
			`/api/stats/currency-rate?start=${input[0]}&end=${input[1]}`
		)

		setIsLoading(false)

		if (status === 'error') return toast.error('Failed to load data.')

		const filteredHistory = filterRates(currencyRates)

		setSeries(prev => {
			const preparedData = {
				name: 'Exchange rate',
				data: filteredHistory.map(item => [item.createdAt, item.rate]),
			}
			return [preparedData]
		})
	}

	const filteredHistory = filterRates(data)

	const [series, setSeries] = useState([
		{
			name: 'Exchange rate',
			data: filteredHistory.map(item => [item.createdAt, item.rate]),
		},
	])

	const [options, setOptions] = useState({
		chart: {
			id: 'area-datetime',
			type: 'area',
			height: 350,
			zoom: {
				// autoScaleYaxis: true,
				enabled: false,
			},
		},

		dataLabels: {
			enabled: false,
		},
		markers: {
			size: 0,
			style: 'hollow',
		},
		xaxis: {
			type: 'datetime',
			labels: {
				style: {
					colors: 'white',
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: 'white',
				},
			},
		},
		tooltip: {
			theme: 'dark',
			x: {
				format: 'dd MMM yyyy',
			},
		},
		fill: {
			type: 'gradient',
		},
	})

	return (
		<Panel
			header={
				<HStack justifyContent='space-between'>
					<span>Exchange rate</span>

					<DateRangePicker
						showHeader={false}
						value={dateRange}
						onChange={loadRates}
						cleanable={false}
						disabled={isLoading}
						placement='bottomEnd'
					/>
				</HStack>
			}
			bordered
		>
			<ApexChart
				options={options}
				series={series}
				type='area'
				width='100%'
				// height={400}
			/>
		</Panel>
	)
}
export default RateHistoryCard
