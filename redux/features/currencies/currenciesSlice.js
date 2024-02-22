import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	currencies: [],
	count: 0,
	isLoading: false,
}

const currenciesSlice = createSlice({
	name: 'currencies',
	initialState,
	reducers: {
		setCurrencies: (state, action) => {
			state.currencies = action.payload
			state.isLoading = false
		},
		setCurrenciesCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetCurrencies: () => initialState,
	},
})

export const getCurrenciesCount = state => state.currencies.count
export const getCurrencies = state => state.currencies.currencies
export const getCurrenciesLoadingState = state =>
	state.currencies.isLoading

export const {
	setCurrencies,
	setCurrenciesCount,
	setLoading,
	resetCurrencies,
} = currenciesSlice.actions
export default currenciesSlice.reducer
