'use client'

import NotificationProfilesDrawer from '@/components/NotificationProfilesDrawer/NotificationProfilesDrawer.jsx'
import NotificationProfilesTable from '@/components/NotificationProfilesTable/NotificationProfilesTable'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import {
	deleteNotificationProfile,
	loadNotificationProfiles,
} from '@/redux/features/notificationProfiles/notificationProfilesActions'
import { useEffect } from 'react'
import { loadAllCredentials } from '@/redux/features/credentials/credentialsActions'

const NotificationProfilesPage = () => {
	const handleDelete = async data => {
		await deleteNotificationProfile(data)
	}

	useEffect(() => {
		loadNotificationProfiles()
		loadAllCredentials()
	}, [])
	return (
		<div>
			<NotificationProfilesDrawer />
			<NotificationProfilesTable />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default NotificationProfilesPage
