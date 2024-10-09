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
			{/* <Row style={{ marginBottom: '.7em' }}>
				<Col xs={10}>
					<ProductStatCard data={data.products} />
				</Col>
			</Row> */}
			<Row style={{ marginBottom: '.7em' }}>
				<Col xs={12}>
					<TotalSalesCard data={data.dailySales} />
				</Col>
				<Col xs={12}>
					<RateHistoryCard data={data.rateHistory} />
				</Col>
			</Row>

			<Row style={{ marginBottom: '.7em' }}>
				<Col xs={12}>
					<TopSellersCard
						data={data.products.topSellers}
						allCategories={data.allCategories}
						rate={data.currentRate}
					/>
				</Col>
				<Col xs={12}>
					<RecentOrdersCard data={data.recentOrders} />
				</Col>
			</Row>
		</Grid>
	)
}
export default Stats
