'use client'

import { Badge } from 'rsuite'

const AcknowledgedStatus = ({ status }) => {
	return (
		<>
			{status ? (
				<Badge content='Acknowleged' color='green'></Badge>
			) : (
				<Badge content='Pending' color='blue'></Badge>
			)}
		</>
	)
}
export default AcknowledgedStatus
