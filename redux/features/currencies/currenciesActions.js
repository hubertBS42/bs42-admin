import { toast } from 'react-toastify'
import {
	setCurrencies,
	setLoading,
	setLimitedCurrencies,
	setCurrenciesCount,
} from './currenciesSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import { setLimitedResources } from '../resources/resourcesSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
const { dispatch } = store

export const loadCurrencies = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { currencies, count },
	} = await fetcher('/api/currencies')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setCurrencies(currencies))
	dispatch(setCurrenciesCount(count))
}

export const sortCurrencies = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { currencies },
	} = await fetcher(
		`/api/currencies?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCurrencies(currencies))
}

export const limitCurrencies = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { currencies },
	} = await fetcher(`/api/currencies?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCurrencies(currencies))
}

export const paginateCurrencies = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { currencies },
	} = await fetcher(
		`/api/currencies?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCurrencies(currencies))
}

export const searchCurrencies = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { currencies },
		} = await fetcher(`/api/currencies?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setCurrencies(currencies))

		return
	}

	const {
		status,
		message,
		data: currencies,
	} = await fetcher(`/api/currencies/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setCurrencies(currencies))
}

export const createCurrency = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(`/api/currencies/checkExists?name=${data.name}`)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const { status, message } = await fetcher('/api/currencies/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Currency created.')
		loadCurrencies()
		return
	}

	toast.error('Failed to create currency.')
}

export const updateCurrency = async (currency, data) => {
	dispatch(setDrawerLoading(true))

	if (currency.name !== data.name) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(`/api/currencies/checkExists?name=${data.name}`)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	const { status, message } = await fetcher(
		`/api/currencies/${currency._id}`,
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
		loadCurrencies()
		return
	}

	toast.error('Failed to update currency.')
}

export const deleteCurrency = async currency => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/currencies/${currency._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'error') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadCurrencies()
	}
}
