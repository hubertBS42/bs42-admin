'use client'
import { HStack, Panel, SelectPicker, Text } from 'rsuite'
import TagIcon from '@rsuite/icons/Tag'
import Chart from 'react-apexcharts'
import { useState } from 'react'
import { fetcher } from '@/utils/functions'
import dynamic from 'next/dynamic'
const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const ProductStatCard = ({ filterBy, data }) => {
	const [options, setOptions] = useState({
		chart: {
			type: 'donut',
		},
		labels: data.categories.map(category => category.name),
		plotOptions: {
			pie: {
				donut: {
					size: '60%',
					labels: {
						show: true,
						value: {
							color: 'white',
							fontWeight: 900,
							fontSize: 22,
						},
						total: {
							show: true,
							showAlways: true,
							fontSize: 16,
							label: 'Total',
							color: 'white',
							formatter: function (w) {
								// Calculate total of all series
								return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
							},
						},
					},
				},
			},
		},
		legend: {
			show: true,
			position: 'bottom',
			labels: {
				colors: 'white',
			},
			markers: {
				offsetX: -3,
			},
			onItemHover: {
				highlightDataSeries: false,
			},
		},
	})

	const [series, setSeries] = useState(
		data.categories.map(category => category.productCount)
	)

	const [isLoading, setIsLoading] = useState(false)

	const handleChange = async value => {
		setIsLoading(true)
		if (value === 'categories') {
			const { status, message, data } = await fetcher(
				'/api/stats/products/categories'
			)

			if (status === 'error') throw new Error('Failed to load data.')

			setOptions(prev => ({
				...prev,
				labels: data.categories.map(category => category.name),
			}))
			setSeries(data.categories.map(category => category.productCount))
		} else {
			const { status, message, data } = await fetcher(
				'/api/stats/products/stock-levels'
			)

			if (status === 'error') throw new Error('Failed to load data.')

			setOptions(prev => ({
				...prev,
				labels: ['In stock', 'Out of stock'],
			}))
			setSeries([data.instock, data.outOfStock])
		}
		setIsLoading(false)
	}
	return (
		<Panel bordered>
			<HStack justifyContent='space-between'>
				<Text weight='semibold' size='lg'>
					Products
				</Text>

				<SelectPicker
					data={[
						{ label: 'Categories', value: 'categories' },
						{ label: 'Stock', value: 'stock' },
					]}
					defaultValue='categories'
					cleanable={false}
					searchable={false}
					onChange={handleChange}
					loading={isLoading}
					disabled={isLoading}
					style={{ width: 140 }}
				/>
				{/* <TagIcon /> */}
			</HStack>
			<ApexChart
				options={options}
				series={series}
				type='donut'
				width='100%'
				// height={400}
			/>
		</Panel>
	)
}
export default ProductStatCard
