'use client'
import { Col, FlexboxGrid, Stack } from 'rsuite'
import AdminIcon from '@rsuite/icons/Admin'

const Stats = () => {
	return (
		<FlexboxGrid justify='space-around' spa>
			<FlexboxGrid.Item as={Col} colspan={24} md={6}>
				<Stack justifyContent='space-between'>
					<AdminIcon />
					<Stack direction='column'>
						<span>Customers</span>
						<span>100</span>
					</Stack>
				</Stack>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item as={Col} colspan={24} md={6}>
				<Stack justifyContent='space-between'>
					<AdminIcon />
					<Stack direction='column'>
						<span>Customers</span>
						<span>100</span>
					</Stack>
				</Stack>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item as={Col} colspan={24} md={6}>
				<Stack justifyContent='space-between'>
					<AdminIcon />
					<Stack direction='column'>
						<span>Customers</span>
						<span>100</span>
					</Stack>
				</Stack>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item as={Col} colspan={24} md={6}>
				<Stack justifyContent='space-between'>
					<AdminIcon />
					<Stack direction='column'>
						<span>Customers</span>
						<span>100</span>
					</Stack>
				</Stack>
			</FlexboxGrid.Item>
		</FlexboxGrid>
	)
}
export default Stats
