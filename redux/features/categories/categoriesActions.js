import { fetcher, formatCategoriesForTable } from '@/utils/functions'
import {
	setLoading,
	setLimitedCategories,
	setAllCategories,
	setCategoriesCount,
} from './categoriesSlice'
import { toast } from 'react-toastify'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import { store } from '@/redux/store'
import {
	deleteImages,
	updateImages,
	uploadImagesToBlob,
} from '@/utils/azure'

const { dispatch } = store

export const loadCategories = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedCategories, allCategories, count },
	} = await fetcher('/api/products/categories')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	const formattedCategories =
		formatCategoriesForTable(limitedCategories)

	dispatch(setLimitedCategories(formattedCategories))
	dispatch(setCategoriesCount(count))

	dispatch(setAllCategories(allCategories))
}

export const sortCategories = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedCategories },
	} = await fetcher(
		`/api/products/categories?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	const formattedCategories =
		formatCategoriesForTable(limitedCategories)

	dispatch(setLimitedCategories(formattedCategories))
}

export const limitCategories = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedCategories },
	} = await fetcher(`/api/products/categories?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}
	const formattedCategories =
		formatCategoriesForTable(limitedCategories)
	dispatch(setLimitedCategories(formattedCategories))
}

export const paginateCategories = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { limitedCategories },
	} = await fetcher(
		`/api/products/categories?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	const formattedCategories =
		formatCategoriesForTable(limitedCategories)

	dispatch(setLimitedCategories(formattedCategories))
}

export const searchCategories = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { limitedCategories },
		} = await fetcher(
			`/api/products/categories?limit=${limit}&page=${page}`
		)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		const formattedCategories =
			formatCategoriesForTable(limitedCategories)

		dispatch(setLimitedCategories(formattedCategories))
		return
	}

	const {
		status,
		message,
		data: limitedCategories,
	} = await fetcher(`/api/products/categories/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		console.log(message)
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setLimitedCategories(limitedCategories))
}

export const createCategory = async data => {
	dispatch(setDrawerLoading(true))

	const blobFiles = data.images.map(image => {
		return image.blobFile
	})

	const uploadedImages = await uploadImagesToBlob(blobFiles)

	//extracting other values from formValue except images
	const { images, ...rest } = data

	//creating new object by combining urls and extracted values from formValue
	const preparedData = { images: uploadedImages, ...rest }

	const { status, message } = await fetcher(
		'/api/products/categories/add',
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
		toast.success('Category created.')
		loadCategories()
		return
	}

	toast.error('Failed to create category')
}

export const updateCategory = async (
	category,
	data,
	imagesToBeDeleted
) => {
	dispatch(setDrawerLoading(true))
	console.log(category)

	// if (imagesToBeDeleted.length > 0) {
	// 	await deleteImages(imagesToBeDeleted)
	// }

	const newImages = data.images
		.filter(image => image.hasOwnProperty('blobFile'))
		.map(file => file.blobFile)

	const uploadedImages = await updateImages(
		newImages,
		imagesToBeDeleted
	)

	const filteredImagesFromForm = data.images.filter(
		image => !image.hasOwnProperty('blobFile')
	)

	// let uploadedImages = []

	// if (newImages.length > 0) {
	// 	uploadedImages = await uploadImagesToBlob(newImages)
	// }

	const updatedImages = filteredImagesFromForm.concat(uploadedImages)

	const { status, message } = await fetcher(
		`/api/products/categories/${category.id || category._id}`,
		{
			method: 'PATCH',
			body: JSON.stringify({ ...data, images: updatedImages }),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success(message)
		loadCategories()
		return
	}

	toast.error('Failed to update category')
}

export const deleteCategory = async category => {
	dispatch(setModalLoading(true))

	const images = category.images.map(image => image.name)

	await deleteImages(images)

	const { status, message } = await fetcher(
		`/api/products/categories/${category.id}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadCategories()
	}
}
