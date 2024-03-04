'use client'

import CredentialsDrawer from '@/components/CredentialsDrawer/CredentialsDrawer.jsx'
import CredentialsTable from '@/components/CredentialsTable/CredentialsTable'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import {
	deleteCredential,
	loadCredentials,
} from '@/redux/features/credentials/credentialsActions'
import { loadAllServers } from '@/redux/features/servers/serversActions'
import { useEffect } from 'react'

const CredentialsPage = () => {
	const handleDelete = async data => {
		await deleteCredential(data)
	}

	useEffect(() => {
		loadCredentials()
		loadAllServers()
	}, [])
	return (
		<div>
			<CredentialsTable />
			<CredentialsDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default CredentialsPage
