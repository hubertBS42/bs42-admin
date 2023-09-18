'use client'

import { Badge } from 'rsuite'

const Status = ({ active }) => {
	return (
		<>
			{active ? (
				<Badge content='Active' color='green'></Badge>
			) : (
				<Badge content='Inactive' color='red'></Badge>
			)}
		</>
	)
}
export default Status
