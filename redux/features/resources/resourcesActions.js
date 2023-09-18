import { fetcher } from '@/utils/functions'
import {
	setLimitedResources,
	setLoading,
	setResourcesCount,
} from './resourcesSlice'
import { toast } from 'react-toastify'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import { store } from '@/redux/store'

const { dispatch } = store

export const loadResources = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { resources, count },
	} = await fetcher('/api/users/resources')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setLimitedResources(resources))
	dispatch(setResourcesCount(count))
}

export const sortResources = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { resources },
	} = await fetcher(
		`/api/users/resources?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedResources(resources))
}

export const limitResources = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { resources },
	} = await fetcher(`/api/users/resources?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedResources(resources))
}

export const paginateResources = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { resources },
	} = await fetcher(
		`/api/users/resources?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedResources(resources))
}

export const searchResources = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { resources },
		} = await fetcher(
			`/api/users/resources?limit=${limit}&page=${page}`
		)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setLimitedResources(resources))
		return
	}

	const {
		status,
		message,
		data: resources,
	} = await fetcher(`/api/users/resources/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedResources(resources))
}

export const createResource = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(`/api/users/resources/checkExists?name=${data.name}`)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const { status, message } = await fetcher(
		'/api/users/resources/add',
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
		toast.success('Resource created.')
		loadResources()
		return
	}

	toast.error('Failed to create resource.')
}

export const updateResource = async (resource, data) => {
	dispatch(setDrawerLoading(true))

	if (resource.name !== data.name) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(`/api/users/resources/checkExists?name=${data.name}`)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	const { status, message } = await fetcher(
		`/api/users/resources/${resource._id}`,
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
		loadResources()
		return
	}

	toast.error('Failed to update manufacturer')
}

export const deleteResource = async resource => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/users/resources/${resource._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadResources()
	}
}
