import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	isLoading: false,
	isOpen: false,
	isEditing: false,
	data: null,
}

const drawerSlice = createSlice({
	name: 'drawer',
	initialState,
	reducers: {
		setDrawerLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setDrawerOpen: (state, action) => {
			state.isOpen = true
			state.isEditing = action.payload?.mode === 'edit' ? true : false
			state.data =
				action.payload.mode === 'edit' ? action.payload.data : null
		},
		setDrawerClose: (state, action) => {
			state.isOpen = false
			state.isLoading = false
		},
		setEditMode: (state, action) => {
			state.isEditing = action.payload
		},
		setData: (state, action) => {
			state.data = action.payload
		},
		resetDrawer: () => initialState,
	},
})

export const getDrawerLoadingState = state => state.drawer.isLoading
export const getDrawerOpenState = state => state.drawer.isOpen
export const getEditState = state => state.drawer.isEditing
export const getDrawerData = state => state.drawer.data

export const {
	setDrawerLoading,
	setDrawerOpen,
	setDrawerClose,
	setEditMode,
	setData,
	resetDrawer,
} = drawerSlice.actions
export default drawerSlice.reducer
