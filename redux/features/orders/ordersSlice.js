import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	orders: [],
	count: 0,
	isLoading: false,
}

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		setOrders: (state, action) => {
			state.orders = action.payload
			state.isLoading = false
		},
		setOrdersCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetOrders: () => initialState,
	},
})

export const selectAllOrders = state => state.orders.orders
export const getOrdersCount = state => state.orders.count
export const getOrdersLoadingState = state => state.orders.isLoading

export const {
	setOrders,
	setOrdersCount,
	setLoading,
	resetMessages,
} = ordersSlice.actions
export default ordersSlice.reducer
