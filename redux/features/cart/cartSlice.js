import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
	cartItems: [],
	isLoading: false,
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setItems: (state, action) => {
			const oldItems = action.payload.filter(item =>
				item.hasOwnProperty('quantity')
			)

			const newItems = action.payload
				.filter(item => !item.hasOwnProperty('quantity'))
				.map(item => {
					return { product: item, quantity: 1, buyPrice: 0 }
				})

			state.cartItems = [...oldItems, ...newItems]

			state.isLoading = false
		},
		modifyItem: (state, action) => {
			const product = state.cartItems.find(
				item => item.product._id === action.payload.product._id
			)

			if (product) {
				product.quantity = action.payload.quantity
				product.product = action.payload.product
				product.buyPrice = action.payload?.buyPrice || 0
				if (product.quantity === 0) {
					state.cartItems = state.cartItems.filter(
						item => item.product._id !== action.payload.product._id
					)
				}
			} else {
				state.cartItems.push({
					product: action.payload.product,
					quantity: action.payload.quantity,
					buyPrice: action.payload?.buyPrice || 0,
				})
			}
		},
		addItem: (state, action) => {
			const product = state.cartItems.find(
				item => item.product._id === action.payload._id
			)

			if (product) {
				product.quantity++
			} else {
				state.cartItems.push({
					product: action.payload,
					quantity: 1,
				})
			}
		},
		removeItem: (state, action) => {
			const product = state.cartItems.find(
				item => item.product._id === action.payload._id
			)

			if (product) {
				state.cartItems = state.cartItems.filter(
					item => item.product._id !== action.payload._id
				)
			}
		},
		setIsLoading: (state, action) => {
			state.isLoading = action.payload
		},
		emptyCart: () => initialState,
	},
})

const cartItems = state => state.cart.cartItems

export const selectAllCartItems = state => state.cart.cartItems
export const getLoadingState = state => state.cart.isLoading

export const totalCartItemSelector = createSelector(
	[cartItems],
	cartItems =>
		cartItems.reduce((total, curr) => (total += curr.quantity), 0)
)

export const totalPriceSelector = createSelector(
	[cartItems],
	cartItems =>
		cartItems.reduce(
			(total, curr) => (total += curr.quantity * curr.product.sellPrice),
			0
		)
)

export const totalBuyPriceSelector = createSelector(
	[cartItems],
	cartItems =>
		cartItems.reduce(
			(total, curr) => (total += curr.quantity * curr.buyPrice),
			0
		)
)

export const productQtyInCartSelector = productId =>
	createSelector([cartItems], cartItems => {
		return cartItems.find(item => item.product._id === productId)
			?.quantity
	})

export const {
	setItems,
	addItem,
	modifyItem,
	removeItem,
	setIsLoading,
	emptyCart,
} = cartSlice.actions
export default cartSlice.reducer
