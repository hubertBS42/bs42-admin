import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	quotations: [],
	rate: 0,
	count: 0,
	isLoading: false,
}

const quotationsSlice = createSlice({
	name: 'quotations',
	initialState,
	reducers: {
		setQuotations: (state, action) => {
			state.quotations = action.payload
			state.isLoading = false
		},
		setQuotationsCount: (state, action) => {
			state.count = action.payload
		},
		setCurrentRate: (state, action) => {
			state.rate = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetQuotations: () => initialState,
	},
})

export const selectAllQuotations = state =>
	state.quotations.quotations
export const getQuotationsCount = state => state.quotations.count
export const getCurrentRate = state => state.quotations.rate
export const getQuotationsLoadingState = state =>
	state.quotations.isLoading

export const {
	setQuotations,
	setCurrentRate,
	setQuotationsCount,
	setLoading,
	resetMessages,
} = quotationsSlice.actions
export default quotationsSlice.reducer
