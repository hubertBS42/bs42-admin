import { fetcher } from '@/utils/functions'
import {
	setLoading,
	setLocations,
	setStockLevelsCount,
	setCurrLocation,
	setProducts,
	setLimitedStockLevels,
	setAllStockLevels,
} from './stockLevelsSlice'
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

export const loadStockLevels = async (location = 'default') => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: {
			limitedStockLevels,
			allStockLevels,
			available,
			count,
			locations,
		},
	} = await fetcher(`/api/stockLevels?location=${location}`)

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

	dispatch(setLimitedStockLevels(limitedStockLevels))
	dispatch(setAllStockLevels(allStockLevels))
	dispatch(setProducts(available))
	dispatch(setLocations(locations))
	dispatch(setCurrLocation(currLocation))
	dispatch(setStockLevelsCount(count))
}

export const sortStockLevels = async (
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
		data: { limitedStockLevels },
	} = await fetcher(
		`/api/stockLevels?location=${location}&limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedStockLevels(limitedStockLevels))
}

export const limitStockLevels = async (limit, location) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedStockLevels },
	} = await fetcher(
		`/api/stockLevels?location=${location}&limit=${limit}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedStockLevels(limitedStockLevels))
}

export const paginateStockLevels = async (
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
		data: { limitedStockLevels },
	} = await fetcher(
		`/api/stockLevels?location=${location}&limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)
	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedStockLevels(limitedStockLevels))
}

export const searchStockLevels = async (
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
			data: { limitedStockLevels, count },
		} = await fetcher(
			`/api/stockLevels?location=${location}&limit=${limit}&page=${page}`
		)

		dispatch(setLoading(false))

		if (status === 'error') {
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setLimitedStockLevels(limitedStockLevels))
		dispatch(setStockLevelsCount(count))
		return
	}

	const {
		status,
		message,
		data: stockLevels,
	} = await fetcher(
		`/api/stockLevels/search?location=${location}&q=${query}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedStockLevels(stockLevels))
	dispatch(setStockLevelsCount(stockLevels.length))
}

export const addStockLevel = async data => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher('/api/stockLevels/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Stock added to location.')
		loadStockLevels(data.location)
		return
	}

	toast.error('Failed to add stock to location.')
}

export const updateStockLevel = async (stockLevel, data) => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/stockLevels/${stockLevel._id}`,
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
		loadStockLevels(data.location)
		return
	}

	toast.error('Failed to update stock.')
}

export const deleteStockLevel = async (stockLevels, location) => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/stockLevels/${stockLevels._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadStockLevels(stockLevels)
	}
}
