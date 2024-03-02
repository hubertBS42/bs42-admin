import { fetcher } from '@/utils/functions'
import {
	setLoading,
	setServers,
	setServersCount,
} from './serversSlice'
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

export const loadServers = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { servers, count },
	} = await fetcher('/api/servers')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setServers(servers))
	dispatch(setServersCount(count))
}

export const sortServers = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { servers },
	} = await fetcher(
		`/api/servers?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setServers(servers))
}

export const limitServers = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { servers },
	} = await fetcher(`/api/servers?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setServers(servers))
}

export const paginateServers = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { servers },
	} = await fetcher(
		`/api/servers?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setServers(servers))
}

export const searchServers = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { servers },
		} = await fetcher(`/api/servers?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setServers(servers))
		return
	}

	const {
		status,
		message,
		data: servers,
	} = await fetcher(`/api/servers/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))

		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setServers(servers))
}

export const createServer = async data => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher('/api/servers/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Server created.')
		loadServers()
		return
	}

	toast.error('Failed to create blog')
}

export const updateServer = async (server, data) => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/servers/${server._id}`,
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
		loadServers()
		return
	}

	toast.error('Failed to update blog')
}

export const deleteServer = async server => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/servers/${server._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadServers()
	}
}
