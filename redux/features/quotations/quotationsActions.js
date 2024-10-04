import { toast } from 'react-toastify'
import {
	setQuotations,
	setLoading,
	setQuotationsCount,
	setCurrentRate,
} from './quotationsSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { getSession } from 'next-auth/react'
const { dispatch } = store

export const loadQuotations = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { quotations, count },
	} = await fetcher('/api/quotations')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setQuotations(quotations))
	dispatch(setQuotationsCount(count))
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

export const sortQuotations = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { quotations },
	} = await fetcher(
		`/api/quotations?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setQuotations(quotations))
}

export const limitQuotations = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { quotations },
	} = await fetcher(`/api/quotations?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setQuotations(quotations))
}

export const paginateQuotations = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { quotations },
	} = await fetcher(
		`/api/quotations?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setQuotations(quotations))
}

export const searchQuotations = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { quotations },
		} = await fetcher(`/api/quotations?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setQuotations(quotations))

		return
	}

	const {
		status,
		message,
		data: quotations,
	} = await fetcher(`/api/quotations/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setQuotations(quotations))
}

export const createQuotation = async data => {
	const session = await getSession()
	const userID = session?.user.id

	const preparedData = { ...data, createdBy: userID }
	const { status, message } = await fetcher('/api/quotations/add', {
		method: 'POST',
		body: JSON.stringify(preparedData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})

	if (status === 'success') {
		toast.success('Quotation created.')
		return
	}

	toast.error('Failed to create quotation.')
}

export const updateQuotation = async (order, data) => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(
		`/api/quotations/${quotation.quotationNumber}`,
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
		loadQuotations()
		return
	}

	toast.error('Failed to update quotation.')
}
