import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	slides: [],
	count: 0,
	isLoading: false,
}

const slidesSlice = createSlice({
	name: 'slides',
	initialState,
	reducers: {
		setSlides: (state, action) => {
			state.slides = action.payload
			state.isLoading = false
		},
		setSlidesCount: (state, action) => {
			state.count = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		resetSlides: () => initialState,
	},
})

export const selectAllSlides = state => state.slides.slides
export const getSlidesCount = state => state.slides.count
export const getSlidesLoadingState = state => state.slides.isLoading

export const { setSlides, setSlidesCount, setLoading, resetSlides } =
	slidesSlice.actions
export default slidesSlice.reducer
