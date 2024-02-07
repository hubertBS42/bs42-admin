import { fetcher } from '@/utils/functions'
import { setLoading, setBlogs, setBlogsCount } from './blogsSlice'
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

export const loadBlogs = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { blogs, count },
	} = await fetcher('/api/blogs')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setBlogs(blogs))
	dispatch(setBlogsCount(count))
}

export const sortBlogs = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { blogs },
	} = await fetcher(
		`/api/blogs?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBlogs(blogs))
}

export const limitBlogs = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { blogs },
	} = await fetcher(`/api/blogs?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBlogs(blogs))
}

export const paginateBlogs = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { blogs },
	} = await fetcher(
		`/api/blogs?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBlogs(blogs))
}

export const searchBlogs = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { blogs },
		} = await fetcher(`/api/blogs?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setBlogs(blogs))
		return
	}

	const {
		status,
		message,
		data: blogs,
	} = await fetcher(`/api/blogs/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setBlogs(blogs))
}

export const createBlog = async data => {
	dispatch(setDrawerLoading(true))

	const imagesToBeUploaded = [
		data.previewImage[0],
		data.bannerImage[0],
	].map(file => file.blobFile)

	const uploadedImages = await updateBlogImages(imagesToBeUploaded, [])

	const { previewImage, bannerImage, ...rest } = data

	const preparedData = {
		previewImage: uploadedImages[0],
		bannerImage: uploadedImages[1],
		...rest,
	}

	const { status, message } = await fetcher('/api/blogs/add', {
		method: 'POST',
		body: JSON.stringify(preparedData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Blog created.')
		loadBlogs()
		return
	}

	toast.error('Failed to create blog')
}

export const updateBlog = async (blog, data, imagesToBeDeleted) => {
	dispatch(setDrawerLoading(true))

	const imagesToBeUploaded = [
		data.previewImage[0],
		data.bannerImage[0],
	].map(image => {
		if (image.hasOwnProperty('blobFile')) {
			return image.blobFile
		}

		return null
	})

	const uploadedImages = await updateBlogImages(
		imagesToBeUploaded,
		imagesToBeDeleted
	)

	const preparedData = {
		...data,
		previewImage: uploadedImages[0]
			? uploadedImages[0]
			: data.previewImage[0],
		bannerImage: uploadedImages[1]
			? uploadedImages[1]
			: data.bannerImage[0],
	}

	const { status, message } = await fetcher(`/api/blogs/${blog._id}`, {
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
		loadBlogs()
		return
	}

	toast.error('Failed to update blog')
}

export const deleteBlog = async blog => {
	dispatch(setModalLoading(true))

	const images = [blog.previewImage.name, blog.bannerImage.name]

	await deleteImages(images)

	const { status, message } = await fetcher(`/api/blogs/${blog._id}`, {
		method: 'DELETE',
	})

	dispatch(setModalClose())

	if (status === 'failed') return toast.error(message)
	if (status === 'success') {
		toast.success(message)
		loadBlogs()
	}
}
