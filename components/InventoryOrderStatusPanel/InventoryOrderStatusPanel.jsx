'use client'
import { orderStatusOptions } from '@/utils/data'
import { useEffect, useState } from 'react'
import { Panel, SelectPicker, Stack, Steps } from 'rsuite'

const InventoryOrderStatusPanel = ({
	status,
	order = null,
	setFormValue,
	editable = true,
	newOrder = false,
}) => {
	const [steps, setSteps] = useState([])
	const [disabledSteps, setDisabledSteps] = useState([])

	useEffect(() => {
		setDisabledSteps(status)

		const setOrderSteps = () => {
			const options = [
				{ label: 'Pending', value: 'created' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Delivering', value: 'delivering' },
				{ label: 'Delivered', value: 'delivered' },
				{ label: 'Cancelled', value: 'cancelled' },
			]
			const data = [...options]
			if (newOrder) data.pop()
			setSteps(data)
		}

		setOrderSteps()
	}, [])

	const renderSteps = (steps, status) => {
		let data = steps
		if (status.includes('cancelled')) {
			const filteredSteps = steps.filter(step => {
				if (status.includes(step.value)) {
					return step
				}
			})

			data = filteredSteps
		} else {
			data = steps.filter(step => step.value !== 'cancelled')
		}

		return (
			<Steps
				current={data.findIndex(
					step => step.value === status[status.length - 1]
				)}
			>
				{data.map(step => (
					<Steps.Item title={step.label} key={step.label} />
				))}
			</Steps>
		)
	}

	return (
		<Panel
			header={
				<Stack justifyContent='space-between'>
					<span>Order status</span>
					{editable && (
						<SelectPicker
							data={steps}
							searchable={false}
							cleanable={false}
							style={{ width: 224 }}
							value={status[status.length - 1]}
							disabledItemValues={disabledSteps}
							onChange={value => {
								if (value === 'cancelled') {
									const data = order.status.map(event => event.type)
									data.push('cancelled')
									setFormValue(prev => ({
										...prev,
										status: data,
									}))
								} else {
									const index = steps.findIndex(step => step.value === value)
									const data = steps
										.map(step => step.value)
										.slice(0, index + 1)
									setFormValue(prev => ({ ...prev, status: data }))
								}
							}}
						/>
					)}
				</Stack>
			}
			bordered
		>
			{renderSteps(steps, status)}
		</Panel>
	)
}
export default InventoryOrderStatusPanel
