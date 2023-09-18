import { fetcher } from '@/utils/functions'
import {
	setDisabledProducts,
	setLoading,
	setProducts,
	setProductsCount,
} from './productsSlice'
import { toast } from 'react-toastify'
import { setModalClose, setModalLoading } from '../modal/modalSlice'
import { store } from '@/redux/store'
import {
	deleteFiles,
	deleteImages,
	updateFiles,
	updateImages,
} from '@/utils/azure'
import { setAllCategories } from '../categories/categoriesSlice'
import { setBrands } from '../brands/brandsSlice'
import {
	setDrawerClose,
	setDrawerLoading,
} from '../drawer/drawerSlice'

const { dispatch } = store

export const loadData = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { products, disabledProducts, count, categories, brands },
	} = await fetcher('/api/products')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setProducts(products))
	dispatch(setProductsCount(count))
	dispatch(setDisabledProducts(disabledProducts))
	dispatch(setAllCategories(categories))
	dispatch(setBrands(brands))
}

export const sortProducts = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { products },
	} = await fetcher(
		`/api/products?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProducts(products))
}

export const limitProducts = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { products },
	} = await fetcher(`/api/products?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProducts(products))
}

export const paginateProducts = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { products },
	} = await fetcher(
		`/api/products?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProducts(products))
}

export const searchProducts = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { products },
		} = await fetcher(`/api/products?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			console.log(products)
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setProducts(products))
		return
	}

	const {
		status,
		message,
		data: products,
	} = await fetcher(`/api/products/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))

		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProducts(products))
}

export const createProduct = async data => {
	dispatch(setDrawerLoading(true))

	const imagesToBeUploaded = data.images.map(image => {
		return image.blobFile
	})

	const filesToBeUploaded = [
		data.shippingAndReturns || [],
		data.instructions || [],
		data.warranty || [],
	].map(file => {
		if (file !== 'object' && file.length > 0) {
			return file[0].blobFile
		}
		return null
	})

	const [uploadedFiles, uploadedImages] = await Promise.all([
		updateFiles(filesToBeUploaded, []),
		updateImages(imagesToBeUploaded, []),
	])

	//removing images, shippingAndReturns, warranty, instructions from formValue
	const {
		images,
		shippingAndReturns,
		warranty,
		instructions,
		...rest
	} = data

	//replacing removed fields from formValue with new ones
	const preparedData = {
		images: uploadedImages,
		shippingAndReturns: uploadedFiles[0],
		instructions: uploadedFiles[1],
		warranty: uploadedFiles[2],
		...rest,
	}

	const { status, message } = await fetcher('/api/products/add', {
		method: 'POST',
		body: JSON.stringify(preparedData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Product created.')
		loadData()
		return
	}

	toast.error('Failed to create products')
}

export const updateProduct = async (
	product,
	data,
	imagesToBeDeleted,
	filesToBeDeleted
) => {
	dispatch(setDrawerLoading(true))

	const imagesToBeUploaded = data.images
		.filter(image => image.hasOwnProperty('blobFile'))
		.map(file => file.blobFile)

	const existingImages = data.images.filter(
		image => !image.hasOwnProperty('blobFile')
	)

	const filesToBeUploaded = [
		data.shippingAndReturns || [],
		data.instructions || [],
		data.warranty || [],
	].map(file => {
		if (file !== 'object' && file.length > 0) {
			return file[0].blobFile
		}
		return null
	})

	const [uploadedFiles, uploadedImages] = await Promise.all([
		updateFiles(filesToBeUploaded, filesToBeDeleted),
		updateImages(imagesToBeUploaded, imagesToBeDeleted),
	])

	const updatedImages = existingImages.concat(uploadedImages)

	let shippingAndReturns = null
	let instructions = null
	let warranty = null

	const submittedShipping = Array.isArray(data.shippingAndReturns)
		? null
		: data.shippingAndReturns
	const submittedInstructions = Array.isArray(data.instructions)
		? null
		: data.instructions
	const submittedWarranty = Array.isArray(data.warranty)
		? null
		: data.warranty

	if (!uploadedFiles[0] && submittedShipping) {
		shippingAndReturns = submittedShipping
	} else if (uploadedFiles[0]) {
		shippingAndReturns = uploadedFiles[0]
	}

	if (!uploadedFiles[1] && submittedInstructions) {
		instructions = submittedInstructions
	} else if (uploadedFiles[1]) {
		instructions = uploadedFiles[1]
	}

	if (!uploadedFiles[2] && submittedWarranty) {
		warranty = submittedWarranty
	} else if (uploadedFiles[2]) {
		warranty = uploadedFiles[2]
	}

	const preparedData = {
		...data,
		images: updatedImages,
		shippingAndReturns,
		instructions,
		warranty,
	}

	const { status, message } = await fetcher(
		`/api/products/${product.slug}`,
		{
			method: 'PATCH',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}
	)
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success(message)
		loadData()
		return
	}

	toast.error('Failed to update product.')
}

export const deleteProduct = async product => {
	dispatch(setModalLoading(true))

	const files = [
		product.shippingAndReturns,
		product.instructions,
		product.warranty,
	]
		.filter(file => file)
		.map(file => file.name)

	const images = product.images.map(image => image.name)

	await Promise.all([deleteFiles(files), deleteImages(images)])

	const { status, message } = await fetcher(
		`/api/products/${product.slug}`,
		{
			method: 'DELETE',
		}
	)

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadData()
	}
}
