import { toast } from 'react-toastify'
import {
	setCredentials,
	setLoading,
	setLimitedCredentials,
	setCredentialsCount,
} from './credentialsSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
const { dispatch } = store

export const loadCredentials = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { credentials, count },
	} = await fetcher('/api/credentials')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setCredentials(credentials))
	dispatch(setCredentialsCount(count))
}

export const loadAllCredentials = async () => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher(
		'/api/credentials/all'
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setCredentials(data))
}

export const sortCredentials = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { credentials },
	} = await fetcher(
		`/api/credentials?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCredentials(credentials))
}

export const limitCredentials = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { credentials },
	} = await fetcher(`/api/credentials?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCredentials(credentials))
}

export const paginateCredentials = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { credentials },
	} = await fetcher(
		`/api/credentials?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCredentials(credentials))
}

export const searchCredentials = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { credentials },
		} = await fetcher(`/api/credentials?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setCredentials(credentials))

		return
	}

	const {
		status,
		message,
		data: credentials,
	} = await fetcher(`/api/credentials/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCredentials(credentials))
}

export const createCredential = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(`/api/credentials/checkExists?label=${data.label}`)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const { status, message } = await fetcher('/api/credentials/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Credential created.')
		loadCredentials()
		return
	}

	toast.error('Failed to create credential.')
}

export const updateCredential = async (credential, data) => {
	dispatch(setDrawerLoading(true))

	if (credential.label !== data.label) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(`/api/credentials/checkExists?label=${data.label}`)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	const { status, message } = await fetcher(
		`/api/credentials/${credential._id}`,
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
		loadCredentials()
		return
	}

	toast.error('Failed to update credential.')
}

export const deleteCredential = async credential => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/credentials/${credential._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'error') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadCredentials()
	}
}
