import { toast } from 'react-toastify'
import {
	setOrders,
	setLoading,
	setOrdersCount,
	setCurrentRate,
} from './ordersSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { getSession } from 'next-auth/react'
const { dispatch } = store

export const loadOrders = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { orders, count, currentRate },
	} = await fetcher('/api/orders')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setOrders(orders))
	dispatch(setOrdersCount(count))
	dispatch(setCurrentRate(currentRate))
}

export const loadCurrentRate = async () => {
	dispatch(setLoading(true))

	const { status, message, rate } = await fetcher(
		'/api/currencies/current-rate'
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setCurrentRate(rate))
}

export const sortOrders = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { orders },
	} = await fetcher(
		`/api/orders?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setOrders(orders))
}

export const limitOrders = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { orders },
	} = await fetcher(`/api/orders?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setOrders(orders))
}

export const paginateOrders = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { orders },
	} = await fetcher(
		`/api/orders?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setOrders(orders))
}

export const searchOrders = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { orders },
		} = await fetcher(`/api/orders?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setOrders(orders))

		return
	}

	const {
		status,
		message,
		data: orders,
	} = await fetcher(`/api/orders/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setOrders(orders))
}

export const createOrder = async data => {
	const { status, message } = await fetcher('/api/orders/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})

	if (status === 'success') {
		toast.success('Order created.')
		return
	}

	toast.error('Failed to create order.')
}

export const updateOrder = async (order, data) => {
	dispatch(setDrawerLoading(true))
	const session = await getSession()
	const userID = session?.user.id

	let preparedData = data

	// if (data.status === 'acknowledged') {
	// 	preparedData = {
	// 		...data,
	// 		acknowledgedOn: Date.now(),
	// 		attendedBy: userID,
	// 	}
	// }

	// if (data.status === 'completed') {
	// 	preparedData = {
	// 		...data,
	// 		acknowledgedOn: Date.now(),
	// 		completedOn: Date.now(),
	// 		attendedBy: userID,
	// 	}
	// }

	const { status, message } = await fetcher(
		`/api/orders/${order._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerClose())
	dispatch(setDrawerLoading(false))

	if (status === 'success') {
		toast.success(message)
		loadOrders()
		return
	}

	toast.error('Failed to update order.')
}
