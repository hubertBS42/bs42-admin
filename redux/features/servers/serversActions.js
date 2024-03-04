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

export const loadAllServers = async () => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher('/api/servers/all')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setServers(data))
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

	toast.error('Failed to update server')
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

export const addCredential = async (server, data) => {
	const preparedData = {
		...server,
		credentials: server.credentials.concat(data),
	}

	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/servers/${server._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerLoading(false))

	if (status === 'success') {
		toast.success('Credential has been added successfully')
		loadServers()
		return 'success'
	}

	toast.error('Failed to add credential.')
	return 'failed'
}

export const updateCredential = async (server, credential, data) => {
	const updatedCredentials = server.credentials.map(item => {
		if (item._id === credential._id) {
			return { ...item, ...data }
		}
		return item
	})

	const preparedData = {
		...server,
		credentials: updatedCredentials,
	}

	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/servers/${server._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerLoading(false))

	if (status === 'success') {
		toast.success('Credential has been updated successfully')
		loadServers()
		return 'success'
	}

	toast.error('Failed to update credential.')
	return 'failed'
}

export const deleteCredential = async (server, credential) => {
	const updatedCredentials = server.credentials.filter(
		item => item._id !== credential._id
	)

	const preparedData = {
		...server,
		credentials: updatedCredentials,
	}

	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/servers/${server._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setModalLoading(false))

	if (status === 'success') {
		toast.success('Credential has been deleted successfully')
		loadServers()
		return 'success'
	}

	toast.error('Failed to delete credential.')
	return 'failed'
}
