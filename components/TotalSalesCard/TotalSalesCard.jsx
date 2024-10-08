'use client'
import { HStack, Panel, Text } from 'rsuite'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { filterRates, roundMoney } from '@/utils/functions'
const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const TotalSalesCard = ({ data }) => {
	const [series, setSeries] = useState([
		{
			name: 'Total Sales',
			data: data.map(item => roundMoney(item.totalSales * item.rate)),
		},
	])

	const [options, setOptions] = useState({
		chart: {
			type: 'bar',
			height: 350,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
				endingShape: 'rounded',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		xaxis: {
			categories: data.map(item => item._id),
			labels: {
				style: {
					colors: 'white',
				},
			},
		},
		yaxis: {
			title: {
				text: 'Total Sales (GHS)',
				style: {
					color: 'white',
				},
			},
			labels: {
				style: {
					colors: 'white',
				},
			},
		},
		fill: {
			opacity: 1,
		},
		tooltip: {
			theme: 'dark',
			y: {
				formatter: function (val) {
					return 'GHS ' + val
				},
			},
		},
	})

	return (
		<Panel bordered>
			<HStack justifyContent='space-between'>
				<Text weight='semibold' size='lg'>
					Total sales
				</Text>
			</HStack>
			<ApexChart
				options={options}
				series={series}
				type='bar'
				width='100%'
				// height={400}
			/>
		</Panel>
	)
}
export default TotalSalesCard
