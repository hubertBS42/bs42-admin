'use client'

import { Badge } from 'rsuite'

const MessageStatus = ({ status }) => {
	return (
		<Badge
			style={{ textTransform: 'capitalize' }}
			content={status}
			color={
				status === 'pending'
					? 'orange'
					: status === 'acknowledged'
					? 'cyan'
					: 'green'
			}
		/>
	)
}
export default MessageStatus
