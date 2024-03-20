'use client'

import ResourcesTable from '@/components/ResourcesTable/ResourcesTable'
import ResourcesDrawer from '@/components/ResourcesDrawer/ResourcesDrawer'
import {
	deleteResource,
	loadResources,
} from '@/redux/features/resources/resourcesActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'

const ResourcesPage = () => {
	const handleDelete = async data => {
		await deleteResource(data)
	}

	useEffect(() => {
		loadResources()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<ResourcesTable />
			<ResourcesDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default ResourcesPage
