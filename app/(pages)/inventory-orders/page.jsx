'use client'

// import StockLevelsTable from '@/components/StockLevelsTable/StockLevelsTable'
import styles from './page.module.scss'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadStockLevels } from '@/redux/features/stockLevels/stockLevelsActions'

const InventoryOrdersPage = () => {
	// useEffect(() => {
	// 	loadStockLevels()
	// }, [])
	return (
		<div className={styles.mainWrapper}>
			{/* <StockLevelsTable /> */}
		</div>
	)
}
export default InventoryOrdersPage
