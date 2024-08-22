import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	suppliers: [],
	count: 0,
	isLoading: true,
}

const suppliersSlice = createSlice({
	name: 'suppliers',
	initialState,
	reducers: {
		setSuppliers: (state, action) => {
			state.suppliers = action.payload
			state.isLoading = false
		},
		setSuppliersCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetSuppliers: () => initialState,
	},
})

export const selectAllSuppliers = state => state.suppliers.suppliers
export const getSuppliersCount = state => state.suppliers.count
export const getSuppliersLoadingState = state =>
	state.suppliers.isLoading

export const {
	setSuppliers,
	setSuppliersCount,
	setLoading,
	resetSuppliers,
} = suppliersSlice.actions
export default suppliersSlice.reducer
