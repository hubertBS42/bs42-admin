import { fetcher } from '@/utils/functions'
import {
	setLimitedRoles,
	setLoading,
	setRoles,
	setRolesCount,
} from './rolesSlice'
import { toast } from 'react-toastify'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import { store } from '@/redux/store'
import { setAllResources } from '../resources/resourcesSlice'

const { dispatch } = store

export const loadData = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { roles, count, resources },
	} = await fetcher('/api/users/roles')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setLimitedRoles(roles))
	dispatch(setRolesCount(count))
	dispatch(setAllResources(resources))
}

export const sortRoles = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { roles },
	} = await fetcher(
		`/api/users/roles?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedRoles(roles))
}

export const limitRoles = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { roles },
	} = await fetcher(`/api/users/roles?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedRoles(roles))
}

export const paginateRoles = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { roles },
	} = await fetcher(
		`/api/users/roles?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedRoles(roles))
}

export const searchRoles = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { roles },
		} = await fetcher(`/api/users/roles?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setLimitedRoles(roles))
		return
	}

	const {
		status,
		message,
		data: roles,
	} = await fetcher(`/api/users/roles/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedRoles(roles))
}

export const createRole = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(`/api/users/roles/checkExists?title=${data.title}`)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const { status, message } = await fetcher('/api/users/roles/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Role was successfully created.')
		loadData()
		return
	}

	toast.error('Failed to create role.')
}

export const updateRole = async (role, data) => {
	dispatch(setDrawerLoading(true))

	if (role.title !== data.title) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(`/api/users/roles/checkExists?title=${data.title}`)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	const { status, message } = await fetcher(
		`/api/users/roles/${role._id}`,
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
		loadData()
		return
	}

	toast.error('Failed to update role.')
}

export const deleteRole = async role => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/users/roles/${role._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadData()
	}
}
