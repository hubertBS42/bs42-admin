import { fetcher } from '@/utils/functions'
import { setLoading, setSlides, setSlidesCount } from './slidesSlice'
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
	updateBlogImages,
	updateImages,
	uploadImagesToBlob,
} from '@/utils/azure'

const { dispatch } = store

export const loadSlides = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { slides, count },
	} = await fetcher('/api/slides')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setSlides(slides))
	dispatch(setSlidesCount(count))
}

export const sortSlides = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { slides },
	} = await fetcher(
		`/api/slides?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSlides(slides))
}

export const limitSlides = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { slides },
	} = await fetcher(`/api/slides?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSlides(slides))
}

export const paginateSlides = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { slides },
	} = await fetcher(
		`/api/slides?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSlides(slides))
}

export const searchSlides = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { slides },
		} = await fetcher(`/api/slides?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setSlides(slides))
		return
	}

	const {
		status,
		message,
		data: slides,
	} = await fetcher(`/api/slides/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setSlides(slides))
}

export const createSlide = async data => {
	dispatch(setDrawerLoading(true))

	const blobFile = data.image[0].blobFile

	let uploadedImage = await uploadImagesToBlob([blobFile])

	const { image, ...rest } = data

	const preparedData = {
		image: uploadedImage[0],
		cta: {
			label: data.ctaLabel,
			url: data.ctaURL,
		},
		...rest,
	}

	const { status, message } = await fetcher('/api/slides/add', {
		method: 'POST',
		body: JSON.stringify(preparedData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Slide has been added.')
		loadSlides()
		return
	}

	toast.error('Failed to add slide')
}

export const updateSlide = async (slide, data, imageToBeDeleted) => {
	dispatch(setDrawerLoading(true))

	let uploadedImage = null

	if (data.image[0].hasOwnProperty('blobFile')) {
		const blobFile = data.image[0].blobFile
		uploadedImage = await updateImages([blobFile], imageToBeDeleted)
	}

	const { image, ...rest } = data

	let preparedData

	if (!uploadedImage) {
		preparedData = {
			cta: {
				label: data.ctaLabel,
				url: data.ctaURL,
			},
			...rest,
		}
	} else {
		preparedData = {
			image: uploadedImage[0],
			cta: {
				label: data.ctaLabel,
				url: data.ctaURL,
			},
			...rest,
		}
	}

	const { status, message } = await fetcher(
		`/api/slides/${slide._id}`,
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
		loadSlides()
		return
	}

	toast.error('Failed to update slide')
}

export const deleteSlide = async slide => {
	dispatch(setModalLoading(true))

	await deleteImages([slide.image.name])

	const { status, message } = await fetcher(
		`/api/slides/${slide._id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadSlides()
	}
}
