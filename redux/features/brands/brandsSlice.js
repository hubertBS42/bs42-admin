import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	brands: [],
	count: 0,
	isLoading: false,
}

const brandsSlice = createSlice({
	name: 'brands',
	initialState,
	reducers: {
		setBrands: (state, action) => {
			state.brands = action.payload
			state.isLoading = false
		},
		setBrandsCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetBrands: () => initialState,
	},
})

export const selectAllBrands = state => state.brands.brands
export const getBrandsCount = state => state.brands.count
export const getBrandsLoadingState = state => state.brands.isLoading

export const { setBrands, setBrandsCount, setLoading, resetBrands } =
	brandsSlice.actions
export default brandsSlice.reducer
