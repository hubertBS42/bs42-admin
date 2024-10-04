'use client'
import { HStack, Panel, Text } from 'rsuite'
import dynamic from 'next/dynamic'
import { useState } from 'react'
const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const RateHistoryCard = () => {
	const [options, setOptions] = useState({
		chart: {
			type: 'line',
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
	return (
		<Panel bordered>
			<HStack justifyContent='space-between'>
				<Text weight='semibold' size='lg'>
					Dollar to Cedi Rates
				</Text>
			</HStack>
			<ApexChart
				options={options}
				series={series}
				type='line'
				width='100%'
				// height={400}
			/>
		</Panel>
	)
}
export default RateHistoryCard
