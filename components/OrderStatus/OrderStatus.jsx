'use client'

import { Badge } from 'rsuite'

const OrderStatus = ({ status }) => {
	return (
		<Badge
			style={{ textTransform: 'capitalize' }}
			content={status}
			color={
				status === 'pending'
					? 'orange'
					: status === 'processing'
					? 'yellow'
					: status === 'shipped'
					? 'cyan'
					: status === 'complete'
					? 'green'
					: 'red'
			}
		/>
	)
}
export default OrderStatus
