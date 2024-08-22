import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	limitedCategories: [],
	allCategories: [],
	count: 0,
	isLoading: true,
}

const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		setLimitedCategories: (state, action) => {
			state.limitedCategories = action.payload
			state.isLoading = false
		},
		setCategoriesCount: (state, action) => {
			state.count = action.payload
		},
		setAllCategories: (state, action) => {
			state.allCategories = action.payload
			state.isLoading = false
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetCategories: () => initialState,
	},
})

export const selectLimitedCategories = state =>
	state.categories.limitedCategories
export const selectAllCategories = state =>
	state.categories.allCategories
export const getCategoriesCount = state => state.categories.count
export const getCategoriesLoadingState = state =>
	state.categories.isLoading

export const {
	setLimitedCategories,
	setAllCategories,
	setCategoriesCount,
	setLoading,
	resetCategories,
} = categoriesSlice.actions
export default categoriesSlice.reducer
