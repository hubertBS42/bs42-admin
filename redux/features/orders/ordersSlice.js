import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	orders: [],
	rate: 0,
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
		setCurrentRate: (state, action) => {
			state.rate = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetOrders: () => initialState,
	},
})

export const selectAllOrders = state => state.orders.orders
export const getOrdersCount = state => state.orders.count
export const getCurrentRate = state => state.orders.rate
export const getOrdersLoadingState = state => state.orders.isLoading

export const {
	setOrders,
	setCurrentRate,
	setOrdersCount,
	setLoading,
	resetMessages,
} = ordersSlice.actions
export default ordersSlice.reducer
