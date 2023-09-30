import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	currencies: [],
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
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetCurrencies: () => initialState,
	},
})

export const getCurrencies = state => state.currencies.currencies
export const getCurrenciesLoadingState = state =>
	state.currencies.isLoading

export const { setCurrencies, setLoading, resetCurrencies } =
	currenciesSlice.actions
export default currenciesSlice.reducer
