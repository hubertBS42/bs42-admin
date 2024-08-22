'use client'

import LocationsTable from '@/components/LocationsTable/LocationsTable'
import LocationsDrawer from '@/components/LocationsDrawer/LocationsDrawer'
import {
	deleteLocation,
	loadLocations,
} from '@/redux/features/locations/locationsActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'

const BrandsPage = () => {
	const handleDelete = async data => {
		await deleteLocation(data)
	}

	useEffect(() => {
		loadLocations()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<LocationsTable />
			<LocationsDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default BrandsPage
