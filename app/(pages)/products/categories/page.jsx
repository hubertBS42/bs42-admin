'use client'

import CategoriesTable from '@/components/CategoriesTable/CategoriesTable'
import CategoriesDrawer from '@/components/CategoriesDrawer/CategoriesDrawer'
import {
	deleteCategory,
	loadCategories,
} from '@/redux/features/categories/categoriesActions'
import styles from './page.module.scss'
import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'

const CategoriesPage = () => {
	const handleDelete = async data => {
		await deleteCategory(data)
	}

	useEffect(() => {
		loadCategories()
	}, [])

	return (
		<div className={styles.mainWrapper}>
			<CategoriesTable />
			<CategoriesDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default CategoriesPage
