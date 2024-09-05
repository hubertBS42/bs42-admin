import { fetcher } from '@/utils/functions'
import {
	setLoading,
	setLocations,
	setLocationsCount,
} from './locationsSlice'
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

export const loadLocations = async () => {
	dispatch(setLocations([]))
	dispatch(setLoading(true))
	const {
		status,
		message,
		data: { locations, count },
	} = await fetcher('/api/locations')

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setLocations(locations))
	dispatch(setLocationsCount(count))
}

export const loadStorage = async () => {
	dispatch(setLocations([]))
	dispatch(setLoading(true))
	const { status, message, data } = await fetcher(
		'/api/locations/storage'
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setLocations(data))
}

export const sortLocations = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { locations },
	} = await fetcher(
		`/api/locations?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLocations(locations))
}

export const limitLocations = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { locations },
	} = await fetcher(`/api/locations?limit=${limit}`)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLocations(locations))
}

export const paginateLocations = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { locations },
	} = await fetcher(
		`/api/locations?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)
	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLocations(locations))
}

export const searchLocations = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { locations },
		} = await fetcher(`/api/locations?limit=${limit}&page=${page}`)

		dispatch(setLoading(false))

		if (status === 'error') {
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setLocations(locations))
		return
	}

	const {
		status,
		message,
		data: locations,
	} = await fetcher(`/api/locations/search?q=${query}`)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLocations(locations))
}

export const createLocation = async (data, router) => {
	const {
		status,
		message,
		data: location,
	} = await fetcher('/api/locations/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})

	if (status === 'success') {
		router.push(`/locations/${location._id}`)
		toast.success('Location created successfully.')
		return
	}

	toast.error('Failed to create Location.')
}

export const createStorage = async data => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		'/api/locations/storage/add',
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
		toast.success('Location updated successfully.')
		loadStorage()
		return
	}

	toast.error('Failed to add Location.')
}

export const updateLocation = async (location, data, router) => {
	const { status, message } = await fetcher(
		`/api/locations/${location._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)

	if (status === 'success') {
		router.push('/locations')
		toast.success(message)
		return
	}

	toast.error('Failed to update location.')
}

export const updateStorage = async (storage, data) => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/locations/storage/${storage.id}`,
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
		loadStorage()
		return
	}

	toast.error('Failed to update storage.')
}

export const deleteLocation = async location => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/locations/${location.id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadStorage()
	}
}

export const deleteStorage = async storage => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/locations/storage/${storage.id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadStorage()
	}
}
