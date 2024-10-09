'use client'
import { HStack, Panel, Text } from 'rsuite'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { filterRates } from '@/utils/functions'
const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const RateHistoryCard = ({ data }) => {
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
		<Panel header='Exchange rate' bordered>
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
