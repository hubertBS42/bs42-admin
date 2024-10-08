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
import RateHistoryCard from '../RateHistoryCard/RateHistoryCard'
import TotalSalesCard from '../TotalSalesCard/TotalSalesCard'
import RecentOrdersCard from '../RecentOrdersCard/RecentOrdersCard'
import TopSellersCard from '../TopSellersCard/TopSellersCard'

const Stats = ({ data }) => {
	return (
		<Grid fluid>
			<Row style={{ marginBottom: '.7em' }}>
				<Col xs={10}>
					<ProductStatCard data={data.products} />
				</Col>
				<Col xs={14}>
					<RateHistoryCard data={data.rateHistory} />
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

			<Row style={{ marginBottom: '.7em' }}>
				<Col xs={16}>
					<TotalSalesCard data={data.weeklySales} />
				</Col>
			</Row>
			<Row>
				<Col xs={16}>
					<RecentOrdersCard data={data.recentOrders} />
				</Col>
				<Col xs={8}>
					<Panel bordered header='Top Sellers'>
						<Placeholder.Paragraph />
					</Panel>
				</Col>
			</Row>
			<Row>
				<Col xs={24}>
					<TopSellersCard
						data={data.products.topSellers}
						allCategories={data.allCategories}
						rate={data.currentRate}
					/>
				</Col>
			</Row>
		</Grid>
	)
}
export default Stats
