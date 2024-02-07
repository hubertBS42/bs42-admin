import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	blogs: [],
	count: 0,
	isLoading: false,
}

const blogsSlice = createSlice({
	name: 'blogs',
	initialState,
	reducers: {
		setBlogs: (state, action) => {
			state.blogs = action.payload
			state.isLoading = false
		},
		setBlogsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetBrands: () => initialState,
	},
})

export const selectAllBlogs = state => state.blogs.blogs
export const getBlogsCount = state => state.blogs.count
export const getBlogsLoadingState = state => state.blogs.isLoading

export const { setBlogs, setBlogsCount, setLoading, resetBlogs } =
	blogsSlice.actions
export default blogsSlice.reducer
