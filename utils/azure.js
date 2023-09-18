import { BlobServiceClient } from '@azure/storage-blob'

// const picturesContainer = 'pictures'
const picturesContainer = 'testpictures'
const filesContainer = 'testfiles'
const vidoesContainer = 'videos'
// const filesContainer = 'files'

const storageName =
	process.env.NEXT_PUBLIC_AZURE_STORAGE_RESOURCE_NAME
const token = process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN

const url = `https://${storageName}.blob.core.windows.net/?${token}`

const blobService = new BlobServiceClient(url)

const picturesContainerClient =
	blobService.getContainerClient(picturesContainer)

const filesContainerClient =
	blobService.getContainerClient(filesContainer)

// export const getBlobsInContainer = async () => {
// 	const returnedBlobUrls = []

// 	// get list of blobs in container
// 	// eslint-disable-next-line
// 	for await (const blob of picturesContainerClient.listBlobsFlat()) {
// 		const blobItem = {
// 			url: `https://${storageName}.blob.core.windows.net/${picturesContainer}/${blob.name}?${token}`,
// 			name: blob.name,
// 		}

// 		// if image is public, just construct URL
// 		returnedBlobUrls.push(blobItem)
// 	}

// 	return returnedBlobUrls
// }

const createBlobInPicturesContainer = async file => {
	const ext = file.name.split('.').pop()
	const newFilename = Date.now() + '.' + ext

	// create blobClient for container
	const blobClient =
		picturesContainerClient.getBlockBlobClient(newFilename)

	// set mimetype as determined from browser with file upload control
	const options = {
		blobHTTPHeaders: { blobContentType: file.type },
	}

	// upload file
	await blobClient.uploadData(file, options)

	return newFilename
}

const createBlobInFilesContainer = async file => {
	const ext = file.name.split('.').pop()
	const newFilename = Date.now() + '.' + ext

	// create blobClient for container
	const blobClient =
		filesContainerClient.getBlockBlobClient(newFilename)

	// set mimetype as determined from browser with file upload control
	const options = {
		blobHTTPHeaders: { blobContentType: file.type },
	}

	// upload file
	await blobClient.uploadData(file, options)

	return newFilename
}

export const deleteImages = async files => {
	// include: Delete the base blob and all of its snapshots.
	// only: Delete only the blob's snapshots and not the blob itself.

	const options = {
		deleteSnapshots: 'include', // or 'only'
	}

	const queries = []

	for (const file of files) {
		// Create blob client from container client
		const blobClient = picturesContainerClient.getBlockBlobClient(file)
		queries.push(blobClient.deleteIfExists(options))
	}

	await Promise.all(queries)
}

export const deleteFiles = async files => {
	// include: Delete the base blob and all of its snapshots.
	// only: Delete only the blob's snapshots and not the blob itself.

	if (files.length === 0) return

	const options = {
		deleteSnapshots: 'include', // or 'only'
	}

	const queries = []

	for (const file of files) {
		// Create blob client from container client
		const blobClient = filesContainerClient.getBlockBlobClient(file)
		queries.push(blobClient.deleteIfExists(options))
	}
	await Promise.all(queries)
}

export const uploadImagesToBlob = async files => {
	if (files.length === 0) return

	const queries = []

	for (const file of files) {
		queries.push(createBlobInPicturesContainer(file))
	}

	const uploadedImages = await Promise.all(queries)

	const formatted = uploadedImages.map(image => {
		return {
			name: image,
			url: `https://${storageName}.blob.core.windows.net/${picturesContainer}/${image}`,
		}
	})

	return formatted
}

export const updateImages = async (toBeUploaded, toBeDeleted) => {
	const queries = []

	if (toBeUploaded.length > 0) {
		for (const file of toBeUploaded) {
			queries.push(createBlobInPicturesContainer(file))
		}
	}

	if (toBeDeleted.length > 0) {
		const options = {
			deleteSnapshots: 'include', // or 'only'
		}
		for (const file of toBeDeleted) {
			const blobClient = picturesContainerClient.getBlockBlobClient(file)
			queries.push(blobClient.deleteIfExists(options))
		}
	}

	const data = await Promise.all(queries)

	const pictures = data.filter(picture => typeof picture !== 'object')

	const formatted = pictures.map(image => {
		return {
			name: image,
			url: `https://${storageName}.blob.core.windows.net/${picturesContainer}/${image}`,
		}
	})

	return formatted
}

export const updateFiles = async (toBeUploaded, toBeDeleted) => {
	const queries = []
	const indices = []

	if (toBeDeleted.length > 0) {
		const options = {
			deleteSnapshots: 'include', // or 'only'
		}
		for (const file of toBeDeleted) {
			const blobClient = filesContainerClient.getBlockBlobClient(file)
			queries.push(blobClient.deleteIfExists(options))
		}
	}

	if (toBeUploaded.length > 0) {
		toBeUploaded.forEach((file, i) => {
			if (file !== null) {
				queries.push(createBlobInFilesContainer(file))
			} else {
				indices.push(i)
			}
		})
	}

	const data = await Promise.all(queries)

	const files = data.filter(file => typeof file !== 'object')

	const formatted = files.map((file, i) => {
		return {
			name: file,
			url: `https://${storageName}.blob.core.windows.net/${filesContainer}/${file}`,
			fileKey: i,
		}
	})

	indices.map(index => {
		formatted.splice(index, 0, null)
	})

	return formatted

	// let currentIndex = 0

	// return formatted.map((file, i) => {
	// 	if (currentIndex < indices.length && i === indices[currentIndex]) {
	// 		currentIndex++
	// 		return null
	// 	}
	// 	return file
	// })

	// const uploadedFile = await createBlobInFilesContainer(file)
	// const link = `https://${storageName}.blob.core.windows.net/${filesContainer}/${uploadedFile}`

	// return { name: uploadedFile, url: link, fileKey: 1 }
}
