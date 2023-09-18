import { fetcher } from '@/utils/functions'
import { setRates, setLoading } from './ratesSlice'
import { toast } from 'react-toastify'
import { store } from '@/redux/store'

const { dispatch } = store

export const loadRates = async () => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher(
		'/api/settings/rates'
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load rates.') //message site admin about error
	}

	dispatch(setRates(data))
}

export const createRate = async data => {
	dispatch(setLoading(true))

	const { status, message } = await fetcher(
		'/api/settings/rates/add',
		{
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setLoading(false))

	if (status === 'success') {
		toast.success('Rate created.')
		loadRates()
		return
	}

	toast.error('Failed to create rate.')
}

export const updateRate = async (rate, data) => {
	dispatch(setLoading(true))

	const { status, message } = await fetcher(
		`/api/settings/rates/${rate._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)

	dispatch(setLoading(false))

	if (status === 'success') {
		toast.success(message)
		loadRates()
		return
	}

	toast.error('Failed to update rate')
}
