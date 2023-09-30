import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	settings: {},
	count: 0,
	isLoading: false,
}

const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings: (state, action) => {
			state.settings = action.payload
			state.isLoading = false
		},
		setSettingsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetSettings: () => initialState,
	},
})

export const getSettings = state => state.settings.settings
export const getSettingsLoadingsState = state =>
	state.settings.isLoading

export const {
	setSettings,
	setSettingsCount,
	setLoading,
	resetSettings,
} = settingsSlice.actions
export default settingsSlice.reducer
