import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	isLoading: false,
	rates: [],
}

const ratesSlice = createSlice({
	name: 'rates',
	initialState,
	reducers: {
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setRates: (state, action) => {
			state.rates = action.payload
			state.isLoading = false
		},
		resetRates: () => initialState,
	},
})

export const getLoadingState = state => state.rates.isLoading
export const getRates = state => state.rates.rates

export const { setLoading, setRates, resetRates } = ratesSlice.actions
export default ratesSlice.reducer
