import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	allUsers: [],
	users: [],
	count: 0,
	isLoading: false,
}

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUsers: (state, action) => {
			state.users = action.payload
			state.isLoading = false
		},
		setAllUsers: (state, action) => {
			state.allUsers = action.payload
			state.isLoading = false
		},
		setUsersCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetUsers: () => initialState,
	},
})

export const selectAllUsers = state => state.users.allUsers
export const selectUsers = state => state.users.users
export const getUsersCount = state => state.users.count
export const getUsersLoadingState = state => state.users.isLoading

export const {
	setUsers,
	setAllUsers,
	setUsersCount,
	setLoading,
	resetUsers,
} = usersSlice.actions
export default usersSlice.reducer
