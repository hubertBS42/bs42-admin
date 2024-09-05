import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	limitedStockLevels: [],
	allStockLevels: [],
	locations: [],
	products: [],
	currLocation: '',
	count: 0,
	isLoading: true,
}

const stockLevelsSlice = createSlice({
	name: 'stockLevels',
	initialState,
	reducers: {
		setLimitedStockLevels: (state, action) => {
			state.limitedStockLevels = action.payload
			state.isLoading = false
		},
		setAllStockLevels: (state, action) => {
			state.allStockLevels = action.payload
			state.isLoading = false
		},
		setProducts: (state, action) => {
			state.products = action.payload
		},
		setLocations: (state, action) => {
			state.locations = action.payload
		},
		setCurrLocation: (state, action) => {
			state.currLocation = action.payload
		},
		setStockLevelsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetStockLevels: () => initialState,
	},
})

export const selectLimitedStockLevels = state =>
	state.stockLevels.limitedStockLevels
export const selectAllStockLevels = state =>
	state.stockLevels.allStockLevels
export const selectAllProducts = state => state.stockLevels.products
export const selectAllLocations = state => state.stockLevels.locations
export const selectCurrLocation = state =>
	state.stockLevels.currLocation
export const getStockLevelsCount = state => state.stockLevels.count
export const getStockLevelsLoadingState = state =>
	state.stockLevels.isLoading

export const {
	setLimitedStockLevels,
	setAllStockLevels,
	setLocations,
	setProducts,
	setCurrLocation,
	setStockLevelsCount,
	setLoading,
	resetStockLevels,
} = stockLevelsSlice.actions
export default stockLevelsSlice.reducer
