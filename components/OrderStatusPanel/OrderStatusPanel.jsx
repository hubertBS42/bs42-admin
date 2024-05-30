'use client'
import { useEffect, useState } from 'react'
import { Panel, SelectPicker, Stack, Steps } from 'rsuite'

const OrderStatusPanel = ({
	orderDetails,
	setStatus,
	status,
	editable = true,
	newOrder = false,
}) => {
	const [steps, setSteps] = useState([])
	const [disabledSteps, setDisabledSteps] = useState([])

	useEffect(() => {
		setDisabledSteps(status)

		if (orderDetails.shipping.method === 'delivery') {
			const data = [
				{ label: 'Pending', value: 'created' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Delivering', value: 'delivering' },
				{ label: 'Payment received', value: 'paymentReceived' },
				{ label: 'Delivered', value: 'delivered' },
			]
			!newOrder && data.push({ label: 'Cancelled', value: 'cancelled' })
			setSteps(data)
		} else {
			const data = [
				{ label: 'Pending', value: 'created' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Ready for pickup', value: 'readyForPickup' },
				{ label: 'Payment received', value: 'paymentReceived' },
				{ label: 'Picked up', value: 'pickedUp' },
			]
			!newOrder && data.push({ label: 'Cancelled', value: 'cancelled' })
			setSteps(data)
		}
	}, [
		orderDetails.shipping.method,
		newOrder,
		orderDetails.products,
		orderDetails.rate,
	])

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
									const data = orderDetails.status.map(event => event.type)
									data.push('cancelled')
									setStatus(data)
								} else {
									const index = steps.findIndex(step => step.value === value)
									const data = steps
										.map(step => step.value)
										.slice(0, index + 1)
									setStatus(data)
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
export default OrderStatusPanel
