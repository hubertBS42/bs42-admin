'use client'

import InventoryTable from '@/components/InventoryTable/InventoryTable'
import {
	deleteInventory,
	loadInventory,
	loadProducts,
} from '@/redux/features/inventory/inventoryActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import InventoryDrawer from '@/components/InventoryDrawer/InventoryDrawer'
import { useSelector } from 'react-redux'
import { selectCurrLocation } from '@/redux/features/inventory/inventorySlice'

const StockManagementPage = () => {
	const location = useSelector(selectCurrLocation)

	const handleDelete = async data => {
		await deleteInventory(data, location)
	}

	useEffect(() => {
		loadInventory()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<InventoryTable />
			<InventoryDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default StockManagementPage
