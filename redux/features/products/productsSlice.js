import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	products: [],
	currentRate: 0,
	disabledProducts: [],
	count: 0,
	isLoading: false,
}

const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setProducts: (state, action) => {
			state.products = action.payload
			state.isLoading = false
		},
		setCurrentRate: (state, action) => {
			state.currentRate = action.payload
		},
		setProductsCount: (state, action) => {
			state.count = action.payload
		},
		setDisabledProducts: (state, action) => {
			state.disabledProducts = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetProducts: () => initialState,
	},
})

export const selectAllProducts = state => state.products.products
export const getCurrentRate = state => state.products.currentRate
export const selectAllDisabledProducts = state =>
	state.products.disabledProducts
export const getProductsCount = state => state.products.count
export const getProductsLoadingState = state =>
	state.products.isLoading

export const {
	setProducts,
	setCurrentRate,
	setProductsCount,
	setDisabledProducts,
	setLoading,
	resetProducts,
} = productsSlice.actions
export default productsSlice.reducer
