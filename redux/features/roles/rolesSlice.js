import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	limitedRoles: [],
	allRoles: [],
	count: 0,
	isLoading: false,
}

const rolesSlice = createSlice({
	name: 'roles',
	initialState,
	reducers: {
		setLimitedRoles: (state, action) => {
			state.limitedRoles = action.payload
			state.isLoading = false
		},
		setAllroles: (state, action) => {
			state.allRoles = action.payload
		},
		setRolesCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetRoles: () => initialState,
	},
})

export const selectAllRoles = state => state.roles.allRoles
export const selectLimitedRoles = state => state.roles.limitedRoles
export const getRolesCount = state => state.roles.count
export const getRolesLoadingState = state => state.roles.isLoading

export const {
	setLimitedRoles,
	setAllroles,
	setRolesCount,
	setLoading,
	resetRoles,
} = rolesSlice.actions
export default rolesSlice.reducer
