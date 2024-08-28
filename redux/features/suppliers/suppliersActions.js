import { fetcher } from '@/utils/functions'
import {
	setLoading,
	setSuppliers,
	setSuppliersCount,
} from './suppliersSlice'
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

export const loadSuppliers = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { suppliers, count },
	} = await fetcher('/api/products/suppliers')

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setSuppliers(suppliers))
	dispatch(setSuppliersCount(count))
}

export const sortSuppliers = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { suppliers },
	} = await fetcher(
		`/api/products/suppliers?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSuppliers(suppliers))
}

export const limitSuppliers = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { suppliers },
	} = await fetcher(`/api/products/suppliers?limit=${limit}`)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSuppliers(suppliers))
}

export const paginateSuppliers = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { suppliers },
	} = await fetcher(
		`/api/products/suppliers?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)
	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSuppliers(suppliers))
}

export const searchSuppliers = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { suppliers },
		} = await fetcher(
			`/api/products/suppliers?limit=${limit}&page=${page}`
		)

		dispatch(setLoading(false))

		if (status === 'error') {
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setSuppliers(suppliers))
		return
	}

	const {
		status,
		message,
		data: suppliers,
	} = await fetcher(`/api/products/suppliers/search?q=${query}`)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSuppliers(suppliers))
}

export const createSupplier = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(
			`/api/products/suppliers/checkExists?name=${data.name}`
		)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const { status, message } = await fetcher(
		'/api/products/suppliers/add',
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
		toast.success('Supplier added.')
		loadSuppliers()
		return
	}

	toast.error('Failed to add supplier.')
}

export const updateSupplier = async (supplier, data) => {
	dispatch(setDrawerLoading(true))

	if (supplier.name !== data.name) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(
				`/api/products/suppliers/checkExists?name=${data.name}`
			)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	const { status, message } = await fetcher(
		`/api/products/suppliers/${supplier._id}`,
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
		loadSuppliers()
		return
	}

	toast.error('Failed to update supplier.')
}

export const deleteSupplier = async supplier => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/products/suppliers/${supplier._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadSuppliers()
	}
}
