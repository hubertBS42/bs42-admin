'use client'

import styles from './page.module.scss'

import { useEffect } from 'react'
import DetailsModal from '@/components/DetailsModal/DetailsModal'
import ApplicationsTable from '@/components/ApplicationsTable/ApplicationsTable'
import { loadApplications } from '@/redux/features/applications/applicationsActions'

const ApplicationsPage = () => {
	useEffect(() => {
		loadApplications()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<ApplicationsTable />
			<DetailsModal />
		</div>
	)
}
export default ApplicationsPage
