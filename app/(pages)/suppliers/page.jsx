'use client'

import SuppliersTable from '@/components/SuppliersTable/SuppliersTable'
import SuppliersDrawer from '@/components/SuppliersDrawer/SuppliersDrawer'
import {
	deleteSupplier,
	loadSuppliers,
} from '@/redux/features/suppliers/suppliersActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'

const BrandsPage = () => {
	const handleDelete = async data => {
		await deleteSupplier(data)
	}

	useEffect(() => {
		loadSuppliers()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<SuppliersTable />
			<SuppliersDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default BrandsPage
