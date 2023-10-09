import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	applications: [],
	count: 0,
	isLoading: false,
}

const applicationsSlice = createSlice({
	name: 'applications',
	initialState,
	reducers: {
		setApplications: (state, action) => {
			state.applications = action.payload
			state.isLoading = false
		},
		setApplicationsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
	},
})

export const selectAllApplications = state =>
	state.applications.applications
export const getApplicationsCount = state => state.applications.count
export const getApplicationsLoadingState = state =>
	state.applications.isLoading

export const { setApplications, setApplicationsCount, setLoading } =
	applicationsSlice.actions
export default applicationsSlice.reducer
