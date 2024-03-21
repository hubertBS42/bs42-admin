'use client'

import styles from './page.module.scss'

import { useEffect } from 'react'
import OrdersTable from '@/components/OrdersTable/OrdersTable'
import { loadOrders } from '@/redux/features/orders/ordersActions'
import OrdersDrawer from '@/components/OrdersDrawer/OrdersDrawer'

const OrdersPage = () => {
	useEffect(() => {
		loadOrders()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<OrdersTable />
			<OrdersDrawer />
		</div>
	)
}
export default OrdersPage
