'use client'

import { Badge } from 'rsuite'

const OrderStatus = ({ data }) => {
	let lastUpdate = data.status.slice(-1)[0]
	let status

	switch (lastUpdate.type) {
		case 'created':
			status = {
				label: 'Pending',
				color: 'orange',
			}
			break
		case 'processing':
			status = {
				label: 'Processing',
				color: 'yellow',
			}
			break
		case 'payment_received':
			status = {
				label: 'Paid',
				color: 'violet',
			}
			break
		case 'delivering':
			status = {
				label: 'Delivering',
				color: 'cyan',
			}
			break
		case 'readyForPickup':
			status = {
				label: 'Pickup ready',
				color: 'cyan',
			}
			break
		case 'delivered':
			status = {
				label: 'Delivered',
				color: 'green',
			}
			break
		case 'paymentReceived':
			status = {
				label: 'Payment received',
				color: 'cyan',
			}
			break
		case 'pickedUp':
			status = {
				label: 'Picked up',
				color: 'green',
			}
			break
		case 'cancelled':
			status = {
				label: 'Cancelled',
				color: 'red',
			}
			break
		default:
			break
	}

	return (
		<Badge
			style={{ textTransform: 'capitalize' }}
			content={status.label}
			color={status.color}
		/>
	)
}
export default OrderStatus
