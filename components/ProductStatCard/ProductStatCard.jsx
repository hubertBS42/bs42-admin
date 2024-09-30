'use client'
import { HStack, Panel, SelectPicker, Text } from 'rsuite'
import TagIcon from '@rsuite/icons/Tag'
import Chart from 'react-apexcharts'
import { useState } from 'react'
import { fetcher } from '@/utils/functions'

const ProductStatCard = ({ filterBy, data }) => {
	const [options, setOptions] = useState({
		chart: {
			type: 'donut',
		},
		labels: data.categories.map(category => category.name),
		// colors: ['#FF4560', '#00E396', '#FEB019', '#775DD0'],
		plotOptions: {
			pie: {
				donut: {
					size: '60%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Total',
							formatter: function (w) {
								// Calculate total of all series
								return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
							},
							style: {
								fontSize: '22px',
								fontWeight: 'bold',
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
					Products overview
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
			<Chart
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
