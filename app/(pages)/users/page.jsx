'use client'

import {
	deleteUser,
	loadData,
} from '@/redux/features/users/usersActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import UsersTable from '@/components/UsersTable/UsersTable'
import UsersDrawer from '@/components/UsersDrawer/UsersDrawer'

const UsersPage = () => {
	const handleDelete = async data => {
		await deleteUser(data)
	}

	useEffect(() => {
		loadData()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<UsersTable />
			<UsersDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default UsersPage
