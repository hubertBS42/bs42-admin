import { fetcher } from '@/utils/functions'
import {
	setLoading,
	setApplications,
	setApplicationsCount,
} from './applicationsSlice'
import { toast } from 'react-toastify'

import {
	setModalClose,
	setModalLoading,
	setModalOpen,
} from '../modal/modalSlice'
import { store } from '@/redux/store'

const { dispatch } = store

export const loadApplications = async () => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher(
		'/api/user-account/new'
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setApplications(data))
	dispatch(setApplicationsCount(data.length))
}

export const sortApplications = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher(
		`/api/user-account/new?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setApplications(data))
}

export const limitApplications = async limit => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher(
		`/api/user-account/new?limit=${limit}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setApplications(data))
}

export const paginateApplications = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher(
		`/api/user-account/new?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setApplications(data))
}

export const searchApplications = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const { status, message, data } = await fetcher(
			`/api/user-account/new?limit=${limit}&page=${page}`
		)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setApplications(data))
		return
	}

	const { status, message, data } = await fetcher(
		`/api/user-account/new/search?q=${query}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setApplications(data))
}

// export const updateApplication = async (application, data) => {
// 	dispatch(setDrawerLoading(true))

// 	const { status, message } = await fetcher(
// 		`/api/products/brands/${brand._id}`,
// 		{
// 			method: 'PATCH',
// 			body: JSON.stringify(preparedData),
// 			headers: {
// 				'Content-type': 'application/json; charset=UTF-8',
// 			},
// 		}
// 	)
// 	dispatch(setDrawerClose())
// 	dispatch(setDrawerLoading(false))

// 	if (status === 'success') {
// 		toast.success(message)
// 		loadBrands()
// 		return
// 	}

// 	toast.error('Failed to update manufacturer')
// }
