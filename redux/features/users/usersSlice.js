import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
		setUsersCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetUsers: () => initialState,
	},
})

export const selectAllUsers = state => state.users.users
export const getUsersCount = state => state.users.count
export const getUsersLoadingState = state => state.users.isLoading

export const { setUsers, setUsersCount, setLoading, resetUsers } =
	usersSlice.actions
export default usersSlice.reducer
