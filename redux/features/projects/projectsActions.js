import { fetcher, getVideoThumbnailBlob } from '@/utils/functions'
import {
	setLoading,
	setProjects,
	setProjectsCount,
} from './projectsSlice'
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
	updateVideos,
	uploadImagesToBlob,
} from '@/utils/azure'

const { dispatch } = store

export const loadProjects = async () => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { projects, count },
	} = await fetcher('/api/projects')

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Failed to load data.') //message site admin about error
	}

	dispatch(setProjects(projects))
	dispatch(setProjectsCount(count))
}

export const sortProjects = async (
	limit,
	page,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { projects },
	} = await fetcher(
		`/api/projects?limit=${limit}&page=${page}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProjects(projects))
}

export const limitProjects = async limit => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { projects },
	} = await fetcher(`/api/projects?limit=${limit}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProjects(projects))
}

export const paginateProjects = async (
	limit,
	value,
	sortColumn,
	sortType
) => {
	dispatch(setLoading(true))

	const {
		status,
		message,
		data: { projects },
	} = await fetcher(
		`/api/projects?limit=${limit}&page=${value}&sortBy=${sortColumn}&sort=${sortType}`
	)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProjects(projects))
}

export const searchProjects = async (query, limit, page) => {
	dispatch(setLoading(true))

	if (query === '') {
		const {
			status,
			message,
			data: { projects },
		} = await fetcher(`/api/projects?limit=${limit}&page=${page}`)

		if (status === 'error') {
			dispatch(setLoading(false))
			return toast.error('Something went wrong.') //message site admin about error
		}

		dispatch(setProjects(projects))
		return
	}

	const {
		status,
		message,
		data: projects,
	} = await fetcher(`/api/projects/search?q=${query}`)

	if (status === 'error') {
		dispatch(setLoading(false))
		return toast.error('Something went wrong.') //message site admin about error
	}

	dispatch(setProjects(projects))
}

export const createProject = async data => {
	dispatch(setDrawerLoading(true))

	const queries = []

	const cardImageBlob = data.cardImg[data.cardImg.length - 1].blobFile
	const mediaImageBlobs = data.media
		.filter(media => media.blobFile.type.includes('image'))
		.map(media => media.blobFile)

	const mediaVideoBlobs = data.media
		.filter(media => media.blobFile.type.includes('video'))
		?.map(media => media.blobFile)

	queries.push(updateImages([cardImageBlob, ...mediaImageBlobs], []))

	if (mediaVideoBlobs.length > 0) {
		queries.push(updateVideos(mediaVideoBlobs, []))
	}

	const [images, videos] = await Promise.all(queries)

	const { cardImg, media, ...rest } = data

	const preparedData = {
		cardImg: images.shift(),
		media: images
			.map(image => ({
				type: 'image',
				thumbnail: {
					name: image.name,
					url: image.url,
				},
				content: {
					name: image.name,
					url: image.url,
				},
			}))
			.concat(videos),
		...rest,
	}

	const { status, message } = await fetcher('/api/projects/add', {
		method: 'POST',
		body: JSON.stringify(preparedData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	dispatch(setDrawerClose())

	if (status === 'success') {
		toast.success('Project has been added.')
		loadProjects()
		return
	}

	toast.error('Failed to add project.')

	// const newCardImg = data.cardImg.findLast(img =>
	// 	img.hasOwnProperty('blobFile')
	// )

	// const newMediaImages = data.media.filter(media =>
	// 	media.blobFile.type.includes('image')
	// )

	// const newMediaVideos = data.media.filter(media =>
	// 	media.blobFile.type.includes('video')
	// )

	// const mediaToBeDeleted = data.media.filter(media => media)

	// let uploadedCardImg = null

	// if (newCardImg) {
	// 	const cardImgToBeDeleted = data.cardImg.filter(
	// 		img => !img.hasOwnProperty('blobFile')
	// 	)

	// 	uploadedCardImg = await updateImages(
	// 		[newCardImg.blobFile],
	// 		cardImgToBeDeleted
	// 	)
	// }

	// const blobFile = data.image[0].blobFile

	// let uploadedImage = await uploadImagesToBlob([blobFile])
}

export const updateProject = async (
	project,
	data,
	mediaToBeDeleted
) => {
	dispatch(setDrawerLoading(true))

	const imagesToBeUploaded = []
	const imagesToBeDeleted = []
	const videosToBeUploaded = []
	const videosToBeDeleted = []

	const cardImageBlob =
		data.cardImg[data.cardImg.length - 1].blobFile || null
	if (cardImageBlob) imagesToBeUploaded.push(cardImageBlob)

	mediaToBeDeleted.forEach(item => {
		if (item.type === 'image') {
			const image = item?.content?.name || item.name
			imagesToBeDeleted.push(image)
		} else {
			videosToBeDeleted.push(item)
		}
	})

	data.media.forEach(item => {
		if (item?.blobFile?.type.includes('video')) {
			videosToBeUploaded.push(item.blobFile)
		}

		if (item?.blobFile?.type.includes('image')) {
			imagesToBeUploaded.push(item.blobFile)
		}
	})

	console.log(imagesToBeDeleted)

	const [uploadedImages, uploadedVideos] = await Promise.all([
		updateImages(imagesToBeUploaded, imagesToBeDeleted),
		updateVideos(videosToBeUploaded, videosToBeDeleted),
	])

	const remainingMedia = project.media.filter(item => {
		const submitted = data.media.map(
			item => item?.thumbnail?.name || item.name
		)
		if (submitted.includes(item.thumbnail.name)) {
			return item
		}
	})

	const preparedData = {
		...data,
		cardImg: cardImageBlob ? uploadedImages.shift() : project.cardImg,
		media: remainingMedia
			.concat(
				uploadedImages.map(image => ({
					type: 'image',
					thumbnail: {
						name: image.name,
						url: image.url,
					},
					content: {
						name: image.name,
						url: image.url,
					},
				}))
			)
			.concat(uploadedVideos),
	}

	const { status, message } = await fetcher(
		`/api/projects/${project._id}`,
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
		loadProjects()
		return
	}

	toast.error('Failed to update project.')
}

// export const deleteSlide = async slide => {
// 	dispatch(setModalLoading(true))

// 	await deleteImages([slide.image.name])

// 	const { status, message } = await fetcher(
// 		`/api/slides/${slide._id}`,
// 		{
// 			method: 'DELETE',
// 		}
// 	)

// 	dispatch(setModalClose())

// 	if (status === 'failed') return toast.error(message)
// 	if (status === 'success') {
// 		toast.success(message)
// 		loadSlides()
// 	}
// }
