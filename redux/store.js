import { configureStore } from '@reduxjs/toolkit'
import categoriesReducer from './features/categories/categoriesSlice'
import brandsReducer from './features/brands/brandsSlice'
import usersReducer from './features/users/usersSlice'
import resourcesReducer from './features/resources/resourcesSlice'
import rolesReducer from './features/roles/rolesSlice'
import productsReducer from './features/products/productsSlice'
import settingsReducer from './features/settings/settingsSlice'
import currenciesReducer from './features/currencies/currenciesSlice'
import modalReducer from './features/modal/modalSlice'
import drawerReducer from './features/drawer/drawerSlice'

export const store = configureStore({
	reducer: {
		categories: categoriesReducer,
		brands: brandsReducer,
		users: usersReducer,
		resources: resourcesReducer,
		roles: rolesReducer,
		products: productsReducer,
		settings: settingsReducer,
		currencies: currenciesReducer,
		modal: modalReducer,
		drawer: drawerReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: ['drawer/setDrawerOpen'],
				// Ignore these field paths in all actions
				ignoredActionPaths: ['payload.data'],
				// Ignore these paths in the state
				ignoredPaths: ['drawer.data'],
			},
		}),
})
