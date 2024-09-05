'use client'

import LocationsTable from '@/components/LocationsTable/LocationsTable'
import { loadLocations } from '@/redux/features/locations/locationsActions'
import styles from './page.module.scss'

import { useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { fetcher } from '@/utils/functions'
import {
	setModalClose,
	setModalLoading,
} from '@/redux/features/modal/modalSlice'

const LocationsPage = () => {
	const dispatch = useDispatch()

	const handleDelete = async data => {
		dispatch(setModalLoading(true))

		const { status, message } = await fetcher(
			`/api/locations/${data._id}`,
			{
				method: 'DELETE',
			}
		)

		dispatch(setModalClose())

		if (status === 'failed') return toast.error(message)
		if (status === 'success') {
			toast.success(message)
			loadLocations()
		}
	}

	useEffect(() => {
		loadLocations()
	}, [])
	return (
		<div className={styles.mainWrapper}>
			<LocationsTable />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default LocationsPage
