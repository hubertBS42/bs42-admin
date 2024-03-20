'use client'

import RolesTable from '@/components/RolesTable/RolesTable'
import RolesDrawer from '@/components/RolesDrawer/RolesDrawer'
import {
	deleteRole,
	loadData,
} from '@/redux/features/roles/rolesActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'

const RolesPage = () => {
	const handleDelete = async data => {
		await deleteRole(data)
	}

	useEffect(() => {
		loadData()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<RolesTable />
			<RolesDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default RolesPage
