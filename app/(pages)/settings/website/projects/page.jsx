'use client'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import ProjectsDrawer from '@/components/ProjectsDrawer/ProjectsDrawer'
import ProjectsTable from '@/components/ProjectsTable/ProjectsTable'
import {
	deleteProject,
	loadProjects,
} from '@/redux/features/projects/projectsActions'
import { useEffect } from 'react'
const ProjectsPage = () => {
	const handleDelete = async data => {
		await deleteProject(data)
	}

	useEffect(() => {
		loadProjects()
	}, [])
	return (
		<>
			<ProjectsTable />
			<ProjectsDrawer />
			<DeleteModal handleDelete={handleDelete} />
		</>
	)
}
export default ProjectsPage
