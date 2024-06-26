'use client'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import ProjectsDrawer from '@/components/ProjectsDrawer/ProjectsDrawer'
import ProjectsTable from '@/components/ProjectsTable/ProjectsTable'
import {
	// deleteProject,
	loadProjects,
} from '@/redux/features/projects/projectsActions'
import { useEffect } from 'react'
const ProjectsPage = () => {
	useEffect(() => {
		loadProjects()
	}, [])
	return (
		<>
			<ProjectsTable />
			<ProjectsDrawer />
		</>
	)
}
export default ProjectsPage
