import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	messages: [],
	count: 0,
	isLoading: false,
}

const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		setMessages: (state, action) => {
			state.messages = action.payload
			state.isLoading = false
		},
		setMessagesCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetMessages: () => initialState,
	},
})

export const selectAllMessages = state => state.messages.messages
export const getMessagesCount = state => state.messages.count
export const getMessagesLoadingState = state =>
	state.messages.isLoading

export const {
	setMessages,
	setMessagesCount,
	setLoading,
	resetMessages,
} = messagesSlice.actions
export default messagesSlice.reducer
