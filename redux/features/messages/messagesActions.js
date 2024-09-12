import { toast } from 'react-toastify'
import {
	setMessages,
	setLoading,
	setMessagesCount,
} from './messagesSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { getSession } from 'next-auth/react'
const { dispatch } = store

export const loadMessages = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { messages, count },
	} = await fetcher('/api/messages')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setMessages(messages))
	dispatch(setMessagesCount(count))
}

export const sortMessages = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { messages },
	} = await fetcher(
		`/api/messages?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setMessages(messages))
}

export const limitMessages = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { messages },
	} = await fetcher(`/api/messages?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setMessages(messages))
}

export const paginateMessages = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { messages },
	} = await fetcher(
		`/api/messages?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setMessages(messages))
}

export const searchMessages = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { messages },
		} = await fetcher(`/api/messages?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setMessages(messages))

		return
	}

	const {
		status,
		message,
		data: messages,
	} = await fetcher(`/api/messages/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setMessages(messages))
}

export const addMessage = async data => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher('/api/messages/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Message added.')
		loadMessages()
		return
	}

	toast.error('Failed to add message.')
}

export const updateMessage = async (message, data) => {
	dispatch(setDrawerLoading(true))
	const session = await getSession()
	const userID = session?.user.id

	let preparedData = data

	if (data.status === 'acknowledged') {
		preparedData = {
			...data,
			acknowledgement: {
				date: message?.acknowledgement?.date || Date.now(),
				user: message?.acknowledgement?.user?._id || userID,
			},
		}
	}

	if (data.status === 'completed') {
		preparedData = {
			...data,
			acknowledgement: {
				date: message?.acknowledgement?.date || Date.now(),
				user: message?.acknowledgement?.user?._id || userID,
			},
			completedOn: message?.completedOn || Date.now(),
		}
	}

	const { status, message: statusMessage } = await fetcher(
		`/api/messages/${message._id}`,
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
		toast.success(statusMessage)
		loadMessages()
		return
	}

	toast.error('Failed to update message.')
}
