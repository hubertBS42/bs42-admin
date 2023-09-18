import { configureStore } from '@reduxjs/toolkit'
import categoriesReducer from './features/categories/categoriesSlice'
import brandsReducer from './features/brands/brandsSlice'
import usersReducer from './features/users/usersSlice'
import resourcesReducer from './features/resources/resourcesSlice'
import rolesReducer from './features/roles/rolesSlice'
import ratesReducer from './features/rates/ratesSlice'
import productsReducer from './features/products/productsSlice'
import modalReducer from './features/modal/modalSlice'
import drawerReducer from './features/drawer/drawerSlice'

export const store = configureStore({
	reducer: {
		categories: categoriesReducer,
		brands: brandsReducer,
		users: usersReducer,
		resources: resourcesReducer,
		roles: rolesReducer,
		rates: ratesReducer,
		products: productsReducer,
		modal: modalReducer,
		drawer: drawerReducer,
	},
})
