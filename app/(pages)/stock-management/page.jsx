'use client'

import StockLevelsTable from '@/components/StockLevelsTable/StockLevelsTable'
import { deleteStockLevel } from '@/redux/features/stockLevels/stockLevelsActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import StockLevelsDrawer from '@/components/StockLevelsDrawer/StockLevelsDrawer'
import { useSelector } from 'react-redux'
import { selectCurrLocation } from '@/redux/features/stockLevels/stockLevelsSlice'
import { loadStockLevels } from '@/redux/features/stockLevels/stockLevelsActions'

const StockManagementPage = () => {
	const location = useSelector(selectCurrLocation)

	const handleDelete = async data => {
		await deleteStockLevel(data, location)
	}

	useEffect(() => {
		loadStockLevels()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<StockLevelsTable />
			<StockLevelsDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default StockManagementPage
