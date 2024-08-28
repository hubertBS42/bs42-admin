import { fetcher } from '@/utils/functions'
import {
	setLoading,
	setLocations,
	setInventoryCount,
	setCurrLocation,
	setProducts,
	setLimitedInventory,
	setAllInventory,
} from './inventorySlice'
import { toast } from 'react-toastify'
import {
	setDrawerClose,
	setDrawerLoading,
	setDrawerOpen,
} from '../drawer/drawerSlice'
import {
	setModalClose,
	setModalLoading,
	setModalOpen,
} from '../modal/modalSlice'
import { store } from '@/redux/store'

const { dispatch } = store

export const loadInventory = async (location = 'default') => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: {
			limitedInventory,
			allInventory,
			available,
			count,
			locations,
		},
	} = await fetcher(
		`/api/products/locations/inventory?location=${location}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Failed to load data.') //message site admin about error
	}

	let currLocation

	if (location === 'default') {
		currLocation = locations.find(location => location.isDefault)?._id
	} else {
		currLocation = location
	}

	dispatch(setLimitedInventory(limitedInventory))
	dispatch(setAllInventory(allInventory))
	dispatch(setProducts(available))
	dispatch(setLocations(locations))
	dispatch(setCurrLocation(currLocation))
	dispatch(setInventoryCount(count))
}

export const sortInventory = async (
	limit,
	page,
	sortColumn,
	sortType,
	location
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedInventory },
	} = await fetcher(
		`/api/products/locations/inventory?location=${location}&limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedInventory(limitedInventory))
}

export const limitInventory = async (limit, location) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedInventory },
	} = await fetcher(
		`/api/products/locations/inventory?location=${location}&limit=${limit}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedInventory(limitedInventory))
}

export const paginateInventory = async (
	limit,
	value,
	sortColumn,
	sortType,
	location
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedInventory },
	} = await fetcher(
		`/api/products/locations/inventory?location=${location}&limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)
	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedInventory(limitedInventory))
}

export const searchInventory = async (
	query,
	limit,
	page,
	location
) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { limitedInventory, count },
		} = await fetcher(
			`/api/products/locations/inventory?location=${location}&limit=${limit}&page=${page}`
		)

		dispatch(setLoading(false))

		if (status === 'error') {
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setLimitedInventory(limitedInventory))
		dispatch(setInventoryCount(count))
		return
	}

	const {
		status,
		message,
		data: inventory,
	} = await fetcher(
		`/api/products/locations/inventory/search?location=${location}&q=${query}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedInventory(inventory))
	dispatch(setInventoryCount(inventory.length))
}

export const addInventory = async data => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		'/api/products/locations/inventory/add',
		{
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Inventory added.')
		loadInventory(data.location)
		return
	}

	toast.error('Failed to add Location.')
}

export const updateInventory = async (inventory, data) => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/products/locations/inventory/${inventory._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerClose())
	dispatch(setDrawerLoading(false))

	if (status === 'success') {
		toast.success(message)
		loadInventory(data.location)
		return
	}

	toast.error('Failed to update inventory.')
}

export const deleteInventory = async (inventory, location) => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/products/locations/inventory/${inventory._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadInventory(location)
	}
}
