'use client'
import {
	Col,
	Grid,
	HStack,
	Panel,
	Placeholder,
	Row,
	Text,
} from 'rsuite'

import DetailIcon from '@rsuite/icons/Detail'
import PeoplesIcon from '@rsuite/icons/Peoples'
import CouponIcon from '@rsuite/icons/Coupon'
import ProductStatCard from '../ProductStatCard/ProductStatCard'
// import RateHistoryCard from '../RateHistoryCard/RateHistoryCard'

const Stats = ({ data }) => {
	return (
		<Grid fluid>
			<Row style={{ marginBottom: '.7em' }}>
				<Col xs={10}>
					<ProductStatCard data={data} />
				</Col>
				<Col xs={14}>
					{/* <RateHistoryCard /> */}
					{/* <Panel bordered>
						<HStack justifyContent='space-between'>
							<Text weight='semibold' size='md'>
								Total Orders
							</Text>
							<DetailIcon />
						</HStack>
						<Text size={30} weight='extrabold'>
							100
						</Text>
					</Panel> */}
				</Col>
				{/* <Col xs={8}>
					<Panel bordered>
						<HStack justifyContent='space-between'>
							<Text weight='semibold' size='md'>
								Total Users
							</Text>
							<PeoplesIcon />
						</HStack>
						<Text size={30} weight='extrabold'>
							100
						</Text>
					</Panel>
				</Col> */}
				{/* <Col xs={6}>
					<Panel bordered>
						<HStack justifyContent='space-between'>
							<Text weight='semibold' size='md'>
								Total Brands
							</Text>
							<CouponIcon />
						</HStack>
						<Text size={30} weight='extrabold'>
							100
						</Text>
					</Panel>
				</Col> */}
			</Row>
			<Row>
				<Col xs={16}>
					<Panel bordered header='Recent Orders'>
						<Placeholder.Paragraph />
					</Panel>
				</Col>
				<Col xs={8}>
					<Panel bordered header='Top Sellers'>
						<Placeholder.Paragraph />
					</Panel>
				</Col>
			</Row>
		</Grid>
	)
}
export default Stats
