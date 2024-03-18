'use client'

import TemplatesDrawer from '@/components/TemplatesDrawer/TemplatesDrawer.jsx'
import TemplatesTable from '@/components/TemplatesTable/TemplatesTable'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import {
	deleteTemplate,
	loadTemplates,
} from '@/redux/features/templates/templatesActions'
import { useEffect } from 'react'
import { loadAllCredentials } from '@/redux/features/credentials/credentialsActions'

const TemplatesPage = () => {
	const handleDelete = async data => {
		await deleteTemplate(data)
	}

	useEffect(() => {
		loadTemplates()
		loadAllCredentials()
	}, [])
	return (
		<div>
			<TemplatesDrawer />
			<TemplatesTable />
			<DeleteModal handleDelete={handleDelete} />
		</div>
	)
}
export default TemplatesPage
