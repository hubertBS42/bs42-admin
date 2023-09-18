import { fetcher } from '@/utils/functions'
import { setLoading, setBrands, setBrandsCount } from './brandsSlice'
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

const { dispatch } = store

export const loadBrands = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { brands, count },
	} = await fetcher('/api/products/brands')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setBrands(brands))
	dispatch(setBrandsCount(count))
}

export const sortBrands = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { brands },
	} = await fetcher(
		`/api/products/brands?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBrands(brands))
}

export const limitBrands = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { brands },
	} = await fetcher(`/api/products/brands?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBrands(brands))
}

export const paginateBrands = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { brands },
	} = await fetcher(
		`/api/products/brands?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBrands(brands))
}

export const searchBrands = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { brands },
		} = await fetcher(
			`/api/products/brands?limit=${limit}&page=${page}`
		)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setBrands(brands))
		return
	}

	const {
		status,
		message,
		data: brands,
	} = await fetcher(`/api/products/brands/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBrands(brands))
}

export const createBrand = async data => {
	dispatch(setDrawerLoading(true))

	const { status: existsStatus, message: existsMessage } =
		await fetcher(`/api/products/brands/checkExists?name=${data.name}`)

	if (existsStatus === 'failed') {
		dispatch(setDrawerLoading(false))
		return toast.error(existsMessage)
	}

	const blobFile = data.logo[0].blobFile

	let uploadedLogo = await uploadImagesToBlob([blobFile])
	uploadedLogo = uploadedLogo[0]

	const { logo, ...rest } = data

	const preparedData = { logo: uploadedLogo, ...rest }

	const { status, message } = await fetcher(
		'/api/products/brands/add',
		{
			method: 'POST',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Brand created.')
		loadBrands()
		return
	}

	toast.error('Failed to create manufacturer')
}

export const updateBrand = async (brand, data, imageToBeDeleted) => {
	dispatch(setDrawerLoading(true))

	if (brand.name !== data.name) {
		const { status: existsStatus, message: existsMessage } =
			await fetcher(`/api/products/brands/checkExists?name=${data.name}`)

		if (existsStatus === 'failed') {
			dispatch(setDrawerLoading(false))
			return toast.error(existsMessage)
		}
	}

	let uploadedLogo = null

	if (data.logo[0].hasOwnProperty('blobFile')) {
		const blobFile = data.logo[0].blobFile
		uploadedLogo = await updateImages([blobFile], imageToBeDeleted)
		uploadedLogo = uploadedLogo[0]
	}

	const { logo, ...rest } = data

	let preparedData

	if (!uploadedLogo) {
		preparedData = rest
	} else {
		preparedData = { logo: uploadedLogo, ...rest }
	}

	const { status, message } = await fetcher(
		`/api/products/brands/${brand._id}`,
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
		loadBrands()
		return
	}

	toast.error('Failed to update manufacturer')
}

export const deleteBrand = async brand => {
	dispatch(setModalLoading(true))

	const logo = brand.logo.name

	if (logo) {
		await deleteImages([logo])
	}

	const { status, message } = await fetcher(
		`/api/products/brands/${brand._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadBrands()
	}
}
