'use client'
import { useEffect, useState } from 'react'
import { Panel, SelectPicker, Stack, Steps } from 'rsuite'

const OrderStatusPanel = ({
	orderDetails,
	setStatus,
	status,
	newOrder = false,
}) => {
	const [steps, setSteps] = useState([])

	useEffect(() => {
		if (orderDetails.shipping.method === 'delivery') {
			const data = [
				{ label: 'Pending', value: 'created' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Delivering', value: 'delivering' },
				{ label: 'Delivered', value: 'delivered' },
				{ label: 'Payment received', value: 'paymentReceived' },
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

		if (status === 'cancelled') {
			const events = orderDetails.status.map(event => event.type)
			const filteredSteps = steps.filter(step =>
				events.includes(step.value)
			)
			filteredSteps.push({ label: 'Cancelled', value: 'cancelled' })
			data = filteredSteps
		} else {
			data = steps.filter(step => step.value !== 'cancelled')
		}

		return (
			<Steps current={data.findIndex(step => step.value === status)}>
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
					<SelectPicker
						data={steps}
						searchable={false}
						cleanable={false}
						style={{ width: 224 }}
						value={status}
						disabledItemValues={!newOrder ? ['created'] : []}
						onChange={setStatus}
					/>
				</Stack>
			}
			bordered
		>
			{renderSteps(steps, status)}
		</Panel>
	)
}
export default OrderStatusPanel
