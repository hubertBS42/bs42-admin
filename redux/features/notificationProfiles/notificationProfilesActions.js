import { toast } from 'react-toastify'
import {
	setNotificationProfiles,
	setLoading,
	setLimitedNotificationProfiles,
	setNotificationProfilesCount,
} from './notificationProfilesSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
const { dispatch } = store

export const loadNotificationProfiles = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { profiles, count },
	} = await fetcher('/api/notification-profiles')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setNotificationProfiles(profiles))
	dispatch(setNotificationProfilesCount(count))
}

export const sortNotificationProfiles = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { profiles },
	} = await fetcher(
		`/api/notification-profiles?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setNotificationProfiles(profiles))
}

export const limitNotificationProfiles = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { profiles },
	} = await fetcher(`/api/notifications-profiles?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setNotificationProfiles(profiles))
}

export const paginateNotificationProfiles = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { profiles },
	} = await fetcher(
		`/api/notification-profiles?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setNotificationProfiles(profiles))
}

export const searchNotificationProfiles = async (
	query,
	limit,
	page
) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { profiles },
		} = await fetcher(
			`/api/notification-profiles?limit=${limit}&page=${page}`
		)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setNotificationProfiles(profiles))

		return
	}

	const {
		status,
		message,
		data: profiles,
	} = await fetcher(`/api/notification-profiles/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setNotificationProfiles(profiles))
}

export const createNotificationProfile = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(
			`/api/notification-profiles/checkExists?label=${data.label}`
		)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const { status, message } = await fetcher(
		'/api/notification-profiles/add',
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
		toast.success('Notification Profile has been created.')
		loadNotificationProfiles()
		return
	}

	toast.error('Failed to create notification profile.')
}

export const updateNotificationProfile = async (profile, data) => {
	dispatch(setDrawerLoading(true))

	if (profile.label !== data.label) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(
				`/api/notification-profiles/checkExists?label=${data.label}`
			)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	const { status, message } = await fetcher(
		`/api/notification-profiles/${profile._id}`,
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
		loadNotificationProfiles()
		return
	}

	toast.error('Failed to update notification profile.')
}

export const deleteNotificationProfile = async profile => {
	dispatch(setModalLoading(true))

	const { status, message } = await fetcher(
		`/api/notification-profiles/${profile._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'error') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadNotificationProfiles()
	}
}
