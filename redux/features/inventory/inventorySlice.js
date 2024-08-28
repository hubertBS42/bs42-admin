import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	limitedInventory: [],
	allInventory: [],
	locations: [],
	products: [],
	currLocation: '',
	count: 0,
	isLoading: true,
}

const inventorySlice = createSlice({
	name: 'inventory',
	initialState,
	reducers: {
		setLimitedInventory: (state, action) => {
			state.limitedInventory = action.payload
			state.isLoading = false
		},
		setAllInventory: (state, action) => {
			state.allInventory = action.payload
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
		setInventoryCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetInventory: () => initialState,
	},
})

export const selectLimitedInventory = state =>
	state.inventory.limitedInventory
export const selectAllInventory = state =>
	state.inventory.allInventory
export const selectAllProducts = state => state.inventory.products
export const selectAllLocations = state => state.inventory.locations
export const selectCurrLocation = state =>
	state.inventory.currLocation
export const getInventoryCount = state => state.inventory.count
export const getInventoryLoadingState = state =>
	state.inventory.isLoading

export const {
	setLimitedInventory,
	setAllInventory,
	setLocations,
	setProducts,
	setCurrLocation,
	setInventoryCount,
	setLoading,
	resetInventory,
} = inventorySlice.actions
export default inventorySlice.reducer
