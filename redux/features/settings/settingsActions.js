import { toast } from 'react-toastify'
import {
	setLoading,
	setSettings,
	setSettingsCount,
} from './settingsSlice'
import { store } from '@/redux/store'
import { fetcher } from '@/utils/functions'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { setCurrencies } from '../currencies/currenciesSlice'
const { dispatch } = store

export const loadData = async () => {
	dispatch(setLoading(true))

	const { status, message, data } = await fetcher(
		'/api/settingsAndCurrencies'
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setSettings(data.settings))
	dispatch(setCurrencies(data.currencies))
}

export const addSettings = async data => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher('/api/settings/add', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())
	if (status === 'success') {
		setLoading(false)
		toast.success('Settings were updated successfully.')
		return
	}
	toast.error('Failed to to update settings.')
}

export const updateSettings = async (id, data) => {
	dispatch(setDrawerLoading(true))

	const { status, message } = await fetcher(`/api/settings/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})

	dispatch(setDrawerClose())
	if (status === 'success') {
		setLoading(false)
		toast.success('Settings were updated successfully.')
		return
	}
	toast.error('Failed to to update settings.')
}

// export const updateSetting = async (brand, data, imageToBeDeleted) => {
// 	dispatch(setDrawerLoading(true))

// 	if (brand.name !== data.name) {
// 		const { status: existsStatus, message: existsMessage } =
// 			await fetcher(`/api/products/brands/checkExists?name=${data.name}`)

// 		if (existsStatus === 'failed') {
// 			dispatch(setDrawerLoading(false))
// 			return toast.error(existsMessage)
// 		}
// 	}

// 	let uploadedLogo = null

// 	if (data.logo[0].hasOwnProperty('blobFile')) {
// 		const blobFile = data.logo[0].blobFile
// 		uploadedLogo = await updateImages([blobFile], imageToBeDeleted)
// 		uploadedLogo = uploadedLogo[0]
// 	}

// 	const { logo, ...rest } = data

// 	let preparedData

// 	if (!uploadedLogo) {
// 		preparedData = rest
// 	} else {
// 		preparedData = { logo: uploadedLogo, ...rest }
// 	}

// 	const { status, message } = await fetcher(
// 		`/api/products/brands/${brand._id}`,
// 		{
// 			method: 'PATCH',
// 			body: JSON.stringify(preparedData),
// 			headers: {
// 				'Content-type': 'application/json; charset=UTF-8',
// 			},
// 		}
// 	)
// 	dispatch(setDrawerClose())
// 	dispatch(setDrawerLoading(false))

// 	if (status === 'success') {
// 		toast.success(message)
// 		loadBrands()
// 		return
// 	}

// 	toast.error('Failed to update manufacturer')
// }
