'use client'

import DeleteModal from '@/components/DeleteModal/DeleteModal'

import { useEffect } from 'react'
import {
	deleteProduct,
	loadData,
} from '@/redux/features/products/productsActions'

import ProductsDrawer from '@/components/ProductsDrawer/ProductsDrawer'
import DisabledProductsTable from '@/components/DisabledProductsTable/DisabledProductsTable'

const DisabledProductsPage = () => {
	const handleDelete = async data => {
		await deleteProduct(data)
	}

	useEffect(() => {
		loadData()
	}, [])

	return (
		<>
			<DisabledProductsTable />
			<ProductsDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</>
	)
}
export default DisabledProductsPage
