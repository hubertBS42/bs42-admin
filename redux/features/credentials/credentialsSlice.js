import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	credentials: [],
	count: 0,
	isLoading: false,
}

const credentialsSlice = createSlice({
	name: 'credentials',
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.credentials = action.payload
			state.isLoading = false
		},
		setCredentialsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetCredentials: () => initialState,
	},
})

export const selectAllCredentials = state =>
	state.credentials.credentials
export const getCredentialsCount = state => state.credentials.count
export const getCredentialsLoadingState = state =>
	state.credentials.isLoading

export const {
	setCredentials,
	setCredentialsCount,
	setLoading,
	resetCredentials,
} = credentialsSlice.actions
export default credentialsSlice.reducer
