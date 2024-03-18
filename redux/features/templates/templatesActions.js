import { toast } from 'react-toastify'
import {
	setTemplates,
	setLoading,
	setLimitedTemplates,
	setTemplatesCount,
} from './templatesSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
const { dispatch } = store

export const loadTemplates = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { templates, count },
	} = await fetcher('/api/templates')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setTemplates(templates))
	dispatch(setTemplatesCount(count))
}

export const sortTemplates = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { templates },
	} = await fetcher(
		`/api/templates?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setTemplates(templates))
}

export const limitTemplates = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { templates },
	} = await fetcher(`/api/templates?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setTemplates(templates))
}

export const paginateTemplates = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { templates },
	} = await fetcher(
		`/api/templates?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setTemplates(templates))
}

export const searchTemplates = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { templates },
		} = await fetcher(`/api/templates?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setTemplates(templates))

		return
	}

	const {
		status,
		message,
		data: templates,
	} = await fetcher(`/api/templates/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setTemplates(templates))
}

export const createTemplate = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(`/api/templates/checkExists?label=${data.label}`)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const { status, message } = await fetcher('/api/templates/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Template has been created.')
		loadTemplates()
		return
	}

	toast.error('Failed to create template.')
}

export const updateTemplate = async (template, data) => {
	dispatch(setDrawerLoading(true))

	if (template.label !== data.label) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(`/api/templates/checkExists?label=${data.label}`)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	const { status, message } = await fetcher(
		`/api/templates/${template._id}`,
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
		loadTemplates()
		return
	}

	toast.error('Failed to update template.')
}

export const deleteTemplate = async template => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/templates/${template._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'error') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadTemplates()
	}
}
