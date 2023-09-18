import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	isLoading: false,
	isOpen: false,
	data: null,
}

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setModalLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setModalOpen: (state, action) => {
			state.isOpen = true
			state.data = action.payload
		},
		setModalClose: (state, action) => {
			state.isOpen = false
			state.isLoading = false
		},
		reset: () => initialState,
	},
})

export const getModalLoadingState = state => state.modal.isLoading
export const getModalOpenState = state => state.modal.isOpen
export const getModalData = state => state.modal.data

export const { setModalLoading, setModalOpen, setModalClose, reset } =
	modalSlice.actions
export default modalSlice.reducer
