import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	servers: [],
	count: 0,
	isLoading: false,
}

const serversSlice = createSlice({
	name: 'servers',
	initialState,
	reducers: {
		setServers: (state, action) => {
			state.servers = action.payload
			state.isLoading = false
		},
		setServersCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetServers: () => initialState,
	},
})

export const selectAllServers = state => state.servers.servers
export const getServersCount = state => state.servers.count
export const getServersLoadingState = state => state.servers.isLoading

export const {
	setServers,
	setServersCount,
	setLoading,
	resetServers,
} = serversSlice.actions
export default serversSlice.reducer
