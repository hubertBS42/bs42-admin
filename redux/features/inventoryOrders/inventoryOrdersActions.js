import { toast } from 'react-toastify'
import {
	setInventoryOrders,
	setLoading,
	setInventoryOrdersCount,
} from './inventoryOrdersSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { getSession } from 'next-auth/react'
import { updateFiles } from '@/utils/azure'
const { dispatch } = store

export const loadInventoryOrders = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { inventoryOrders, count },
	} = await fetcher('/api/inventory-orders')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setInventoryOrders(inventoryOrders))
	dispatch(setInventoryOrdersCount(count))
}

export const sortInventoryOrders = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { inventoryOrders },
	} = await fetcher(
		`/api/inventory-orders?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setInventoryOrders(inventoryOrders))
}

export const limitInventoryOrders = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { inventoryOrders },
	} = await fetcher(`/api/inventory-orders?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setInventoryOrders(inventoryOrders))
}

export const paginateInventoryOrders = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { inventoryOrders },
	} = await fetcher(
		`/api/inventory-orders?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setInventoryOrders(inventoryOrders))
}

export const searchInventoryOrders = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { inventoryOrders },
		} = await fetcher(
			`/api/inventory-orders?limit=${limit}&page=${page}`
		)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setInventoryOrders(inventoryOrders))

		return
	}

	const {
		status,
		message,
		data: inventoryOrders,
	} = await fetcher(`/api/inventory-orders/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setInventoryOrders(inventoryOrders))
}

export const createInventoryOrder = async data => {
	const session = await getSession()
	const userID = session?.user.id
	let uploadedFiles = []

	const filesToBeUploaded = data.files.map(file => file.blobFile)

	if (filesToBeUploaded.length > 0) {
		uploadedFiles = await updateFiles(filesToBeUploaded, [])
	}

	let preparedData = { ...data, user: userID, files: uploadedFiles }

	const { status, message } = await fetcher(
		'/api/inventory-orders/add',
		{
			method: 'POST',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)

	if (status === 'success') {
		toast.success('Inventory order created.')
		return
	}

	toast.error('Failed to create inventory order.')
}

export const updateInventoryOrder = async (inventoryOrder, data) => {
	// dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/inventory-orders/${inventoryOrder.orderNumber}`,
		{
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	// dispatch(setDrawerClose())
	// dispatch(setDrawerLoading(false))

	if (status === 'success') {
		toast.success(message)
		loadInventoryOrders()
		return
	}

	toast.error('Failed to update inventory order.')
}
