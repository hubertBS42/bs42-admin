'use client'
import { DateRangePicker, HStack, Panel, Text } from 'rsuite'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { fetcher, filterRates, roundMoney } from '@/utils/functions'
import { subDays } from 'date-fns'
import { toast } from 'react-toastify'
const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const TotalSalesCard = ({ data }) => {
	const last7DaysStart = subDays(new Date(), 6) // Start of last 7 days
	const last7DaysEnd = new Date() // End of last 7 days (today)

	const [dateRange, setDateRange] = useState([
		last7DaysStart,
		last7DaysEnd,
	])
	const [isLoading, setIsLoading] = useState(false)
	const [sumTotal, setSumTotal] = useState(0)

	const calculateTotalSum = sales => {
		const sum = sales.reduce(
			(sum, sale) => sum + sale.totalSales * sale.rate,
			0
		)

		setSumTotal(sum)
	}

	useEffect(() => {
		calculateTotalSum(data)
	}, [])

	const loadSales = async input => {
		setIsLoading(true)
		setDateRange(input)

		const { status, message, data } = await fetcher(
			`/api/stats/sales?start=${input[0]}&end=${input[1]}`
		)

		setIsLoading(false)

		if (status === 'error') return toast.error('Failed to load data.')

		calculateTotalSum(data)
		setSeries(prev => {
			const preparedData = {
				name: 'Total sales',
				data: data.map(item => [
					item._id,
					roundMoney(item.totalSales * item.rate),
				]),
			}
			return [preparedData]
		})
	}
	// const [series, setSeries] = useState([
	// 	{
	// 		name: 'Total Sales',
	// 		data: data.map(item => roundMoney(item.totalSales * item.rate)),
	// 	},
	// ])

	// const [options, setOptions] = useState({
	// 	chart: {
	// 		type: 'bar',
	// 		// height: 100,
	// 	},
	// 	plotOptions: {
	// 		bar: {
	// 			horizontal: false,
	// 			columnWidth: '55%',
	// 			endingShape: 'rounded',
	// 		},
	// 	},
	// 	dataLabels: {
	// 		enabled: false,
	// 	},
	// 	stroke: {
	// 		show: true,
	// 		width: 2,
	// 		colors: ['transparent'],
	// 	},
	// 	xaxis: {
	// 		categories: data.map(item => item._id),
	// 		labels: {
	// 			style: {
	// 				colors: 'white',
	// 			},
	// 		},
	// 	},
	// 	yaxis: {
	// 		title: {
	// 			text: 'Total Sales (GHS)',
	// 			style: {
	// 				color: 'white',
	// 			},
	// 		},
	// 		labels: {
	// 			style: {
	// 				colors: 'white',
	// 			},
	// 		},
	// 	},
	// 	fill: {
	// 		opacity: 1,
	// 	},
	// 	tooltip: {
	// 		theme: 'dark',
	// 		y: {
	// 			formatter: function (val) {
	// 				return 'GHS ' + val
	// 			},
	// 		},
	// 	},
	// })

	const [series, setSeries] = useState([
		{
			name: 'Total sales',
			data: data.map(item => [
				item._id,
				roundMoney(item.totalSales * item.rate),
			]),
		},
	])

	const [options, setOptions] = useState({
		chart: {
			id: 'area-datetime',
			type: 'area',
			// height: 350,
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
			y: {
				formatter: function (val) {
					return 'GHS ' + val
				},
			},
			// x: {
			// 	format: 'dd MMM yyyy',
			// },
		},
		fill: {
			type: 'gradient',
		},
	})

	return (
		<Panel
			header={
				<HStack justifyContent='space-between'>
					<span>
						Total sales:{' '}
						{isLoading ? 'loading...' : `GHS ${roundMoney(sumTotal)}`}
					</span>

					<DateRangePicker
						showHeader={false}
						value={dateRange}
						onChange={loadSales}
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
			/>
		</Panel>
	)
}
export default TotalSalesCard
