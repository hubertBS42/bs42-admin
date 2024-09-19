import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	inventoryOrders: [],
	count: 0,
	isLoading: false,
}

const inventoryOrdersSlice = createSlice({
	name: 'inventoryOrders',
	initialState,
	reducers: {
		setInventoryOrders: (state, action) => {
			state.inventoryOrders = action.payload
			state.isLoading = false
		},
		setInventoryOrdersCount: (state, action) => {
			state.inventoryOrders = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetInventoryOrders: () => initialState,
	},
})

export const selectAllInventoryOrders = state =>
	state.inventoryOrders.inventoryOrders
export const getInventoryOrdersCount = state =>
	state.inventoryOrders.count
export const getInventoryOrdersLoadingState = state =>
	state.inventoryOrders.isLoading

export const {
	setInventoryOrders,
	setInventoryOrdersCount,
	setLoading,
	resetInventoryOrders,
} = inventoryOrdersSlice.actions
export default inventoryOrdersSlice.reducer
