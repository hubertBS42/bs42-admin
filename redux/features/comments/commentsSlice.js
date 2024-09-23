import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	comments: [],
	count: 0,
	isLoading: true,
}

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		setComments: (state, action) => {
			state.comments = action.payload
			state.isLoading = false
		},
		setCommentsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetComments: () => initialState,
	},
})

export const selectAllComments = state => state.comments.comments
export const getCommentsCount = state => state.comments.count
export const getCommentsLoadingState = state =>
	state.comments.isLoading

export const {
	setComments,
	setCommentsCount,
	setLoading,
	resetComments,
} = commentsSlice.actions
export default commentsSlice.reducer
