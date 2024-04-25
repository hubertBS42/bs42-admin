'use client'
import { useEffect, useState } from 'react'
import { Panel, SelectPicker, Stack, Steps } from 'rsuite'

const OrderStatusPanel = ({ orderDetails, setOrderDetails }) => {
	const [orderSteps, setOrderSteps] = useState([
		{ label: 'Pending', value: 'pending' },
		{ label: 'Confirmed', value: 'confirmed' },
		{ label: 'Rejected', value: 'rejected' },
		{ label: 'Processing', value: 'processing' },
		{ label: 'Completed', value: 'completed' },
	])

	useEffect(() => {
		const steps = [...orderSteps]

		// if (orderDetails.status === 'confirmed') {

		// }

		if (orderDetails.shipping.method === 'delivery') {
			const exists = steps.find(step => step.label === 'Delivering')
			if (!exists) {
				steps.splice(4, 0, {
					label: 'Delivering',
					value: 'delivering',
				})
			}
		} else {
			steps.splice(4, 0, { label: 'Ready', value: 'ready' })
		}

		setOrderSteps(steps)
	}, [orderDetails.status, orderDetails.shipping.method])

	const handleStatusChange = value => {
		setOrderDetails(prev => ({ ...prev, status: value }))
	}

	const renderSteps = (current, steps) => {
		const data = [...steps]
		const allowed = [
			'confirmed',
			'processing',
			'delivering',
			'ready',
			'completed',
		]
		if (orderDetails.status === 'pending') data.splice(1, 2)
		if (orderDetails.status === 'rejected') data.splice(1, 1)
		if (allowed.includes(orderDetails.status)) data.splice(2, 1)
		return (
			<Steps current={data.findIndex(step => step.value === current)}>
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
						data={orderSteps}
						searchable={false}
						cleanable={false}
						style={{ width: 224 }}
						defaultValue={orderDetails.status}
						disabledItemValues={['pending']}
						onSelect={handleStatusChange}
					/>
				</Stack>
			}
			bordered
		>
			{renderSteps(orderDetails.status, orderSteps)}
		</Panel>
	)
}
export default OrderStatusPanel
