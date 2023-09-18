import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	limitedResources: [],
	allResources: [],
	count: 0,
	isLoading: false,
}

const resourcesSlice = createSlice({
	name: 'resources',
	initialState,
	reducers: {
		setLimitedResources: (state, action) => {
			state.limitedResources = action.payload
			state.isLoading = false
		},
		setAllResources: (state, action) => {
			state.allResources = action.payload
		},
		setResourcesCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetResources: () => initialState,
	},
})

export const selectAllResources = state =>
	state.resources.allResources
export const selectLimitedResources = state =>
	state.resources.limitedResources
export const getResourcesCount = state => state.resources.count
export const getResourcesLoadingState = state =>
	state.resources.isLoading

export const {
	setLimitedResources,
	setAllResources,
	setResourcesCount,
	setLoading,
	resetResources,
} = resourcesSlice.actions
export default resourcesSlice.reducer
