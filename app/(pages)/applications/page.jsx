'use client'

import styles from './page.module.scss'

import { useEffect } from 'react'
import ApplicationsTable from '@/components/ApplicationsTable/ApplicationsTable'
import { loadApplications } from '@/redux/features/applications/applicationsActions'
import ApplicationsDrawer from '@/components/ApplicationsDrawer/ApplicationsDrawer'

const ApplicationsPage = () => {
	useEffect(() => {
		loadApplications()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<ApplicationsTable />
			<ApplicationsDrawer />
		</div>
	)
}
export default ApplicationsPage
