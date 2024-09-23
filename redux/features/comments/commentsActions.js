import { fetcher, formatComments } from '@/utils/functions'
import {
	setLoading,
	setComments,
	setCommentsCount,
} from './commentsSlice'
import { toast } from 'react-toastify'

import {
	setModalClose,
	setModalLoading,
	setModalOpen,
} from '../modal/modalSlice'
import { store } from '@/redux/store'

const { dispatch } = store

export const loadComments = async (type, typeRef) => {
	dispatch(setComments([]))
	dispatch(setLoading(true))
	const {
		status,
		message,
		data: { comments, count },
	} = await fetcher(`/api/comments?type=${type}&typeRef=${typeRef}`)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setComments(comments))
	dispatch(setCommentsCount(count))
}

export const sortComments = async (
	limit,
	page,
	sortColumn,
	sortType,
	typeRef
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { comments },
	} = await fetcher(
		`/api/comments?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}&typeRef=${typeRef}`
	)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setComments(comments))
}

export const limitComments = async (limit, typeRef) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { comments },
	} = await fetcher(`/api/comments?limit=${limit}&typeRef=${typeRef}`)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setComments(comments))
}

export const paginateComments = async (
	limit,
	value,
	sortColumn,
	sortType,
	typeRef
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { comments },
	} = await fetcher(
		`/api/comments?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}&typeRef=${typeRef}`
	)
	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setComments(comments))
}

export const searchLocations = async (
	query,
	limit,
	page,
	typeRef
) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { comments },
		} = await fetcher(
			`/api/comments?limit=${limit}&page=${page}&typeRef=${typeRef}`
		)

		dispatch(setLoading(false))

		if (status === 'error') {
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setComments(comments))
		return
	}

	const {
		status,
		message,
		data: comments,
	} = await fetcher(`/api/comments/search?q=${query}`)

	dispatch(setLoading(false))

	if (status === 'error') {
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setComments(comments))
}

export const addComment = async data => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: comment,
	} = await fetcher('/api/comments/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})

	dispatch(setLoading(false))

	if (status === 'success') {
		toast.success('Comment added successfully.')
		loadComments(comment.type, comment.typeRef)
		return
	}

	toast.error('Failed to add comment.')
}

export const updateComment = async (comment, data) => {
	const { status, message } = await fetcher(
		`/api/comments/${comment._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)

	if (status === 'success') {
		toast.success(message)
		return
	}

	toast.error('Failed to update comment.')
}

export const deleteComment = async comment => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/comments/${comment.id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadComments()
	}
}
