import { configureStore } from '@reduxjs/toolkit'
import categoriesReducer from './features/categories/categoriesSlice'
import brandsReducer from './features/brands/brandsSlice'
import locationsReducer from './features/locations/locationsSlice'
import suppliersReducer from './features/suppliers/suppliersSlice'
import stockLevelsReducer from './features/stockLevels/stockLevelsSlice'
import blogsReducer from './features/blogs/blogsSlice'
import slidesReducer from './features/slides/slidesSlice'
import projectsReducer from './features/projects/projectsSlice'
import cartReducer from './features/cart/cartSlice'
import usersReducer from './features/users/usersSlice'
import resourcesReducer from './features/resources/resourcesSlice'
import rolesReducer from './features/roles/rolesSlice'
import ordersReducer from './features/orders/ordersSlice'
import inventoryOrdersReducer from './features/inventoryOrders/inventoryOrdersSlice'
import applicationsReducer from './features/applications/applicationsSlice'
import productsReducer from './features/products/productsSlice'
import currenciesReducer from './features/currencies/currenciesSlice'
import serversReducer from './features/servers/serversSlice'
import credentialsReducer from './features/credentials/credentialsSlice'
import templatesReducer from './features/templates/templatesSlice'
import MessagesReducer from './features/messages/messagesSlice'
import modalReducer from './features/modal/modalSlice'
import drawerReducer from './features/drawer/drawerSlice'

export const store = configureStore({
	reducer: {
		categories: categoriesReducer,
		brands: brandsReducer,
		locations: locationsReducer,
		suppliers: suppliersReducer,
		stockLevels: stockLevelsReducer,
		blogs: blogsReducer,
		slides: slidesReducer,
		projects: projectsReducer,
		cart: cartReducer,
		credentials: credentialsReducer,
		templates: templatesReducer,
		messages: MessagesReducer,
		users: usersReducer,
		orders: ordersReducer,
		inventoryOrders: inventoryOrdersReducer,
		resources: resourcesReducer,
		roles: rolesReducer,
		applications: applicationsReducer,
		products: productsReducer,
		currencies: currenciesReducer,
		servers: serversReducer,
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
