'use client'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import ServersTable from '@/components/ServersTable/ServersTable'
import ServersDrawer from '@/components/ServersDrawer/ServersDrawer'
import {
	deleteServer,
	loadServers,
} from '@/redux/features/servers/serversActions'
import { useEffect } from 'react'

const OutgoingServersPage = () => {
	const handleDelete = async data => {
		await deleteServer(data)
	}

	useEffect(() => {
		loadServers()
	}, [])
	return (
		<div>
			<ServersTable />
			<ServersDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default OutgoingServersPage
