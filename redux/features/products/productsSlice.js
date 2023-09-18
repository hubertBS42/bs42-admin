import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	products: [],
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
export const selectAllDisabledProducts = state =>
	state.products.disabledProducts
export const getProductsCount = state => state.products.count
export const getProductsLoadingState = state =>
	state.products.isLoading

export const {
	setProducts,
	setProductsCount,
	setDisabledProducts,
	setLoading,
	resetProducts,
} = productsSlice.actions
export default productsSlice.reducer
