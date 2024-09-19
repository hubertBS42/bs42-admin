'use client'

import styles from './page.module.scss'

import { useEffect } from 'react'
import InventoryOrdersTable from '@/components/InventoryOrdersTable/InventoryOrdersTable'
import { loadInventoryOrders } from '@/redux/features/inventoryOrders/inventoryOrdersActions'

const InventoryOrdersPage = () => {
	useEffect(() => {
		loadInventoryOrders()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<InventoryOrdersTable />
		</div>
	)
}
export default InventoryOrdersPage
