'use client'

// import BrandsTable from '@/components/BrandsTable/BrandsTable'
// import BrandsDrawer from '@/components/BrandsDrawer/BrandsDrawer'
// import {
// 	deleteBrand,
// 	loadBrands,
// } from '@/redux/features/brands/brandsActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'

const BrandsPage = () => {
	// const handleDelete = async data => {
	// 	await deleteBrand(data)
	// }

	// useEffect(() => {
	// 	loadBrands()
	// }, [])
	return (
		<div className={styles.mainWrapper}>
			{/* <BrandsTable />
			<BrandsDrawer />
			<DeleteModal handleDelete={handleDelete} /> */}
		</div>
	)
}
export default BrandsPage
