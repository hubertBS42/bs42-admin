import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	templates: [],
	count: 0,
	isLoading: false,
}

const templatesSlice = createSlice({
	name: 'templates',
	initialState,
	reducers: {
		setTemplates: (state, action) => {
			state.templates = action.payload
			state.isLoading = false
		},
		setTemplatesCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetTemplates: () => initialState,
	},
})

export const selectAllTemplates = state => state.templates.templates
export const getTemplatesCount = state => state.templates.count
export const getTemplatesLoadingState = state =>
	state.templates.isLoading

export const {
	setTemplates,
	setTemplatesCount,
	setLoading,
	resetTemplates,
} = templatesSlice.actions
export default templatesSlice.reducer
