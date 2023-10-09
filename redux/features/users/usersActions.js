import { fetcher } from '@/utils/functions'
import { setLoading, setUsers, setUsersCount } from './usersSlice'
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
import {
	deleteImages,
	updateImages,
	uploadImagesToBlob,
} from '@/utils/azure'
import { setAllroles } from '../roles/rolesSlice'

const { dispatch } = store

export const loadData = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { users, count, roles },
	} = await fetcher('/api/users')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setUsers(users))
	dispatch(setUsersCount(count))
	dispatch(setAllroles(roles))
}

export const sortUsers = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { users },
	} = await fetcher(
		`/api/users?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setUsers(users))
}

export const limitUsers = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { users },
	} = await fetcher(`/api/users?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setUsers(users))
}

export const paginateUsers = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { users },
	} = await fetcher(
		`/api/users?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setUsers(users))
}

export const searchUsers = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { users },
		} = await fetcher(`/api/users?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setUsers(users))
		return
	}

	const {
		status,
		message,
		data: users,
	} = await fetcher(`/api/users/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setUsers(users))
}

export const createUser = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(`/api/users/checkExists?email=${data.email}`)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const blobFile = data.profileImg[0]?.blobFile

	let uploadedProfileImg = null

	if (blobFile) {
		uploadedProfileImg = await uploadImagesToBlob([blobFile])
		uploadedProfileImg = uploadedProfileImg[0]
	}

	const {
		profileImg,
		rStreetName,
		rDigitalAddress,
		rArea,
		rRegion,
		...rest
	} = data

	const preparedData = {
		...rest,
		residentialAddress: {
			streetName: data.rStreetName,
			digitalAddress: data.rDigitalAddress,
			area: data.rArea,
			region: data.rRegion,
		},
		company: {
			name: data.cName,
			phone: data.cPhone,
			website: data.website,
			address: {
				streetName: data.cStreetName,
				digitalAddress: data.cDigitalAddress,
				area: data.cArea,
				region: data.cRegion,
			},
		},
		profileImg: uploadedProfileImg,
	}

	console.log(preparedData)

	const { status, message } = await fetcher('/api/users/add', {
		method: 'POST',
		body: JSON.stringify(preparedData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('User was successfully created.')
		loadData()
		return
	}

	toast.error('Failed to create user.')
}

export const updateUser = async (user, data, imageToBeDeleted) => {
	dispatch(setDrawerLoading(true))

	if (user.email !== data.email) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(`/api/users/checkExists?email=${data.email}`)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	let uploadedProfileImg = null
	const image =
		data.profileImg.length === 0 ? null : data.profileImg[0]

	if (image && image.hasOwnProperty('blobFile')) {
		const blobFile = image.blobFile
		uploadedProfileImg = await updateImages(
			[blobFile],
			imageToBeDeleted
		)
		uploadedProfileImg = uploadedProfileImg[0]
	}

	const {
		profileImg,
		rStreetName,
		rDigitalAddress,
		rArea,
		rRegion,
		...rest
	} = data

	let preparedData = {
		...rest,
		residentialAddress: {
			streetName: data.rStreetName,
			digitalAddress: data.rDigitalAddress,
			area: data.rArea,
			region: data.rRegion,
		},
		company: {
			name: data.cName,
			phone: data.cPhone,
			website: data.website,
			address: {
				streetName: data.cStreetName,
				digitalAddress: data.cDigitalAddress,
				area: data.cArea,
				region: data.cRegion,
			},
		},
		password:
			data.password === 'default' ? user.password : data.password,
	}

	if (!uploadedProfileImg) {
		preparedData = {
			...preparedData,
			profileImg: imageToBeDeleted.length > 0 ? null : user.profileImg,
		}
	} else {
		preparedData = {
			...preparedData,
			profileImg: uploadedProfileImg,
		}
	}

	const { status, message } = await fetcher(`/api/users/${user._id}`, {
		method: 'PATCH',
		body: JSON.stringify(preparedData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())
	dispatch(setDrawerLoading(false))

	if (status === 'success') {
		toast.success(message)
		loadData()
		return
	}

	toast.error('Failed to update user.')
}

export const deleteUser = async user => {
	dispatch(setModalLoading(true))

	const profileImg = user.profileImg?.name

	if (profileImg) {
		await deleteImages([profileImg])
	}

	const { status, message } = await fetcher(`/api/users/${user._id}`, {
		method: 'DELETE',
	})

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadData()
	}
}
