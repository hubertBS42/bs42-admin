import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	projects: [],
	count: 0,
	isLoading: false,
}

const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		setProjects: (state, action) => {
			state.projects = action.payload
			state.isLoading = false
		},
		setProjectsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetProjects: () => initialState,
	},
})

export const selectAllProjects = state => state.projects.projects
export const getProjectsCount = state => state.projects.count
export const getProjectsLoadingState = state =>
	state.projects.isLoading

export const {
	setProjects,
	setProjectsCount,
	setLoading,
	resetProjects,
} = projectsSlice.actions
export default projectsSlice.reducer
