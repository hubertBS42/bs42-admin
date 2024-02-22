'use client'

import ProductsTable from '@/components/ProductsTable/ProductsTable'
import DeleteModal from '@/components/DeleteModal/DeleteModal'

import { useEffect } from 'react'
import {
	deleteProduct,
	loadData,
} from '@/redux/features/products/productsActions'

import styles from './page.module.scss'
import ProductsDrawer from '@/components/ProductsDrawer/ProductsDrawer'
import DisabledProductsNotification from '@/components/DisabledProductsNotification/DisabledProductsNotification'
import { useSelector } from 'react-redux'
import { getCurrentRate } from '@/redux/features/products/productsSlice'

const ProductsPage = () => {
	const handleDelete = async data => {
		await deleteProduct(data)
	}

	useEffect(() => {
		loadData()
	}, [])

	let currentRate = useSelector(getCurrentRate)

	return (
		<div className={styles.mainWrapper}>
			<DisabledProductsNotification />
			<ProductsTable />
			<ProductsDrawer currentRate={currentRate} />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default ProductsPage
