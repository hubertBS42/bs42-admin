import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	locations: [],
	count: 0,
	isLoading: true,
}

const locationsSlice = createSlice({
	name: 'locations',
	initialState,
	reducers: {
		setLocations: (state, action) => {
			state.locations = action.payload
			state.isLoading = false
		},
		setLocationsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetLocations: () => initialState,
	},
})

export const selectAllLocations = state => state.locations.locations
export const getLocationsCount = state => state.locations.count
export const getLocationsLoadingState = state =>
	state.locations.isLoading

export const {
	setLocations,
	setLocationsCount,
	setLoading,
	resetLocations,
} = locationsSlice.actions
export default locationsSlice.reducer
