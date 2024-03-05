import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	notificationProfiles: [],
	count: 0,
	isLoading: false,
}

const notificationProfilesSlice = createSlice({
	name: 'notificationProfiles',
	initialState,
	reducers: {
		setNotificationProfiles: (state, action) => {
			state.notificationProfiles = action.payload
			state.isLoading = false
		},
		setNotificationProfilesCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetNotificationProfiles: () => initialState,
	},
})

export const selectAllNotificationProfiles = state =>
	state.notificationProfiles.notificationProfiles
export const getNotificationProfilesCount = state =>
	state.notificationProfiles.count
export const getNotificationProfilesLoadingState = state =>
	state.notificationProfiles.isLoading

export const {
	setNotificationProfiles,
	setNotificationProfilesCount,
	setLoading,
	resetNotificationProfiles,
} = notificationProfilesSlice.actions
export default notificationProfilesSlice.reducer
