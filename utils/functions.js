import { usePathname } from 'next/navigation'
import { format, isAfter, isBefore, parseISO } from 'date-fns'

export const capitalizeFirstLetter = word => {
	const regex = /(\b[a-z](?!\s))/g

	return word.replace(regex, x => {
		return x.toUpperCase()
	})
}

const removeLastLetter = word => {
	return word.slice(0, -1)
}

export const generatePageTitle = () => {
	let pathname = usePathname()

	if (pathname === '/') {
		pathname = 'dashboard'
	}
	const choppedUp = pathname.split('/')

	if (choppedUp.includes('new')) {
		const words = ['new']

		if (choppedUp[1].includes('-')) {
			const wordsArray = choppedUp[1].split('-')

			wordsArray.forEach((word, i) => {
				if (i === wordsArray.length - 1) {
					words.push(removeLastLetter(word))
					return
				}

				words.push(word)
			})
		} else {
			words.push(removeLastLetter(choppedUp[1]))
		}

		const text = words
			.map(word => capitalizeFirstLetter(word))
			.join(' ')

		return text
	}

	if (choppedUp.includes('edit')) {
		const firstWord = capitalizeFirstLetter(choppedUp.pop())

		const capitalized = capitalizeFirstLetter(
			choppedUp[choppedUp.length - 2]
		)
		const secondWord = removeLastLetter(capitalized)

		return `${firstWord} ${secondWord}`
	}

	return capitalizeFirstLetter(choppedUp.pop().replace(/-/g, ' '))
}

export const fetcher = (...args) =>
	fetch(...args).then(res => res.json())

// export const formatDate = date => new Date(date).toDateString()
// export const formatDate = date => format(date, 'yyyy-MM-dd hh:mm:ss')
export const formatDate = date => format(date, 'dd-MM-yyyy')

export const formatData = data => {
	return data?.map(item => ({
		label: item.title ? item.title : item.name,
		value: item._id ? item._id : item.name,
	}))
}

// function to find descendants of a category
export const findLocationDescendants = (locations, parentId) => {
	const descendants = locations.filter(
		l => l?.parent?._id.toString() === parentId
	)
	descendants.forEach(descendant => {
		descendants.push(
			...findLocationDescendants(locations, descendant._id.toString())
		)
	})
	return descendants
}

export const getDisabledItems = (items, parentId) => {
	const disabledItems = items
		.filter(item => item.parent === parentId)
		.map(item => item._id)
	disabledItems.forEach(item => {
		disabledItems.push(...getDisabledItems(items, item))
	})

	disabledItems.push(parentId)
	return disabledItems
}

export const formatCategoriesForTable = (
	categories,
	parent = null
) => {
	return categories
		.filter(category => category.parent === parent)
		.map(category => ({
			id: category._id,
			name: category.name,
			parent: category.parent,
			slug: category.slug,
			images: category.images,
			isActive: category.isActive,
			createdAt: category.createdAt,
			children: formatCategoriesForTable(categories, category._id),
		}))
}

export const formatLocationsForTable = (locations, parent = null) => {
	return locations
		.filter(location => location?.parent?._id === parent)
		.map(location => ({
			id: location._id,
			name: location.name,
			type: location.type,
			address: location.address,
			parent: location.parent,
			capacity: location.capicity,
			length: location.length,
			contact: location.contact,
			description: location.description,
			level: location.level,
			isActive: location.isActive,
			createdAt: location.createdAt,
			children: formatLocationsForTable(locations, location._id),
		}))
}

// Helper function to find ancestors of a category
const findAncestors = (categories, category) => {
	const ancestors = []
	while (category.parent) {
		const parent = categories.find(
			c => c._id.toString() === category.parent.toString()
		)
		if (parent) {
			ancestors.push(parent)
			category = parent
		} else {
			break
		}
	}
	return ancestors
}

// Helper function to find descendants of a category
const findDescendants = (categories, parentId) => {
	const descendants = categories.filter(c => c.parent === parentId)
	descendants.forEach(descendant => {
		descendants.push(...findDescendants(categories, descendant._id))
	})
	return descendants
}

// Function to search, retrieve ancestors, descendants
export const searchAndRetrieveAncestorsAndDescendants = (
	allCategories,
	matchingCategories
) => {
	// Retrieve all ancestors and descendants
	let categoryMap = new Map()

	matchingCategories.forEach(category => {
		// Add the category itself
		categoryMap.set(category._id, category)

		// // Add ancestors
		const ancestors = findAncestors(allCategories, category)
		ancestors.forEach(ancestor =>
			categoryMap.set(ancestor._id, ancestor)
		)

		// // Add descendants
		const descendants = findDescendants(allCategories, category._id)
		descendants.forEach(descendant =>
			categoryMap.set(descendant._id, descendant)
		)
	})

	// Convert the Map back to an Array for processing
	const allCategoriesArray = Array.from(categoryMap.values())

	return allCategoriesArray
}

export const formatCategoriesForHeader = (
	categories,
	parent = null
) => {
	return categories
		.filter(category => category.parent === parent)
		.map(category => ({
			id: category._id,
			name: category.name,
			description: category.description,
			parent: category.parent,
			slug: category.slug,
			images: category.images,
			isActive: category.isActive,
			createdAt: category.createdAt,
			children: formatCategoriesForTable(categories, category._id),
		}))
}

export const formatCategoriesForTreePicker = (
	categories,
	parent = null
) => {
	const data = categories
		.filter(category => category.parent === parent)
		.map(category => ({
			value: category._id,
			label: category.name,
			children: formatCategoriesForTreePicker(categories, category._id),
		}))
}

export const formatForTreePicker = (items, parent = null) => {
	return items
		.filter(
			item => item.parent === parent || item.parent?._id === parent
		)
		.map(item => ({
			value: item._id,
			label: item.name,
			children: formatForTreePicker(items, item._id),
		}))
}

export const getUnassignedResources = (resources, permissions) => {
	const allResources = resources.map(resource => resource.value)
	const assignedResources = permissions.map(
		permission => permission.resource._id || permission.resource
	)

	let unAssignedResources = allResources.filter(
		resource => !assignedResources.includes(resource)
	)

	const results = resources.filter(resource => {
		if (unAssignedResources.includes(resource.value)) {
			return resource
		}
	})

	return results
}

export const roundMoney = amount => {
	const roundedAmount =
		Math.round(amount * Math.pow(10, 2)) / Math.pow(10, 2)
	return roundedAmount.toFixed(2)
}

export const generatePassword = options => {
	const {
		useSymbols,
		useNumbers,
		useLowerCase,
		useUpperCase,
		passwordLength,
	} = options
	let charset = ''
	let newPassword = ''

	if (useSymbols) charset += '!@#$%^&*()'
	if (useNumbers) charset += '0123456789'
	if (useLowerCase) charset += 'abcdefghijklmnopqrstuvwxyz'
	if (useUpperCase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

	for (let i = 0; i < passwordLength; i++) {
		newPassword += charset.charAt(
			Math.floor(Math.random() * charset.length)
		)
	}

	return newPassword
}

export const combineCartItems = (userCartItems, guestCartItems) => {
	if (userCartItems.length > 0) {
		const combinedCartItems = [...userCartItems]

		guestCartItems.map(guestCartItem => {
			const existingItem = combinedCartItems.find(
				item =>
					item.product._id.toString() ===
					guestCartItem.product._id.toString()
			)
			if (existingItem) {
				existingItem.quantity += guestCartItem.quantity
			} else {
				combinedCartItems.push({ ...guestCartItem })
			}
		})
		return combinedCartItems
	}

	return guestCartItems
}

// Helper function to extract ids from an array of categories
const extractIds = categories => {
	let ids = []

	for (const category of categories) {
		ids.push(category.id)

		if (category.children && category.children.length > 0) {
			// Recursively extract ids from children
			ids.push(...extractIds(category.children))
		}
	}

	return ids
}

export const groupCategories = (categories, parent = null) => {
	return categories
		.filter(category => {
			if (parent === null) return category.parent === parent
			return category.parent?._id === parent
		})
		.map(category => ({
			id: category._id,
			name: category.name,
			parent: category.parent,
			slug: category.slug,
			images: category.images,
			isActive: category.isActive,
			createdAt: category.createdAt,
			children: groupCategories(categories, category._id),
		}))
}

export const groupCategories1 = (categories, parent = null) => {
	return categories
		.filter(category => category.parent === parent)
		.map(category => ({
			id: category._id,
			name: category.name,
			parent: category.parent,
			slug: category.slug,
			images: category.images,
			isActive: category.isActive,
			createdAt: category.createdAt,
			children: groupCategories1(categories, category._id),
		}))
}

export const findIdsOfCategoryAndChildrenBySlug = (
	categories,
	targetSlug
) => {
	for (const category of categories) {
		if (category.slug === targetSlug) {
			const result = [category.id]

			if (category.children && category.children.length > 0) {
				// Recursively extract ids from children
				result.push(...extractIds(category.children))
			}

			return result
		}

		if (category.children && category.children.length > 0) {
			const result = findIdsOfCategoryAndChildrenBySlug(
				category.children,
				targetSlug
			)

			if (result.length > 0) {
				// If the category is found in children, return the result
				return result
			}
		}
	}

	// If the category is not found
	return []
}

export const convertToDollar = (value, rate) => {
	const dollarEquavalent = value / rate
	const roundedUp =
		Math.round(dollarEquavalent * Math.pow(10, 2)) /
		Math.pow(10, 2).toFixed(2)

	return roundedUp
}

export const filterRatesByDateRange = (rates, startDate, endDate) => {
	const filteredRates = rates.reduce((accumulator, rate) => {
		const rateDate = parseISO(rate.date)
		if (isAfter(rateDate, startDate) && isBefore(rateDate, endDate)) {
			const formattedDate = format(rateDate, 'yyyy-MM-dd')
			if (
				!accumulator[formattedDate] ||
				accumulator[formattedDate].rate < rate.rate
			) {
				accumulator[formattedDate] = {
					date: formattedDate,
					rate: rate.rate,
				}
			}
		}
		return accumulator
	}, {})

	return Object.values(filteredRates)
}

export const filterRates = rates => {
	// Step 1: Group rates by day (e.g., '2023-09-01')
	const groupedRates = rates.reduce((acc, rate) => {
		const date = rate.createdAt.split('T')[0] // Extract the date part of the timestamp
		if (!acc[date]) {
			acc[date] = []
		}
		acc[date].push(rate)
		return acc
	}, {})

	// Step 2: For each date, sort the rates by timestamp and get the latest rate
	const latestRates = Object.keys(groupedRates).map(date => {
		// Sort the rates for each day by timestamp in descending order (latest first)
		const sortedRates = groupedRates[date].sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		)

		// Return the latest rate (first in sorted array)
		return sortedRates[0]
	})

	const formatted = latestRates.map(rate => {
		return {
			...rate,
			createdAt: format(rate.createdAt, 'yyyy-MM-dd'),
		}
	})

	return formatted
}

export const hydrateMessage = (message, values) => {
	return message.replace(/\${(.*?)}/g, (match, placeholder) => {
		const key = placeholder.trim() // Extract the key from the placeholder
		const value = values[key] // Get the corresponding value from the provided object

		if (Array.isArray(value)) {
			// Add inline styles for table, headers, and cells
			const tableRows = value
				.map(item => {
					const product = item.title || 'Unknown Product'
					const count = item.count || 0
					return `<tr>
							<td style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${product}</td>
							<td style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${count}</td>
						</tr>`
				})
				.join('') // Create table rows for each item

			return `
				<table style="border-collapse: collapse; width: 100%;">
					<thead>
						<tr>
							<th style="border: 1px solid #dddddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Product</th>
							<th style="border: 1px solid #dddddd; padding: 8px; background-color: #f2f2f2; text-align: left">Count</th>
						</tr>
					</thead>
					<tbody>${tableRows}</tbody>
				</table>
			`
		}

		// If it's not an array, return the value or the original match if the value is undefined
		return value || match
	})
}

// export const replacePlaceholders = (inputString, values) => {
// 	return inputString.replace(/\${(.*?)}/g, (match, placeholder) => {
// 		// `placeholder` contains the name inside the curly braces
// 		// `match` contains the full matched string, including the curly braces
// 		return values[placeholder.trim()] || match
// 	})
// }

// Function to generate date-based invoice numbers
export const generateInvoiceNumber = lastInvoiceNumber => {
	const timestamp = new Date()
	const year = timestamp.getFullYear()
	const month = String(timestamp.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
	const day = String(timestamp.getDate()).padStart(2, '0')

	// Extract the numeric part from the lastInvoiceNumber
	let lastNumber = 0

	if (lastInvoiceNumber !== 0) {
		lastNumber = parseInt(lastInvoiceNumber.match(/\d+$/)[0], 10)
	}

	// Increment the last number for the next invoice
	lastNumber++

	// Adjust padding based on lastNumber
	let paddedInvoiceNumber
	if (lastNumber < 10) {
		paddedInvoiceNumber = `00${lastNumber}`
	} else if (lastNumber < 100) {
		paddedInvoiceNumber = `0${lastNumber}`
	} else {
		paddedInvoiceNumber = `${lastNumber}`
	}

	// Combine date and number to create the invoice number
	const invoiceNumber = `${year}${month}${day}_${paddedInvoiceNumber}`

	return invoiceNumber
}

export const generateRandomCode = () => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let randomCode = ''

	for (let i = 0; i < 8; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		randomCode += characters.charAt(randomIndex)
	}

	return randomCode
}

export const findActiveKey = (links, pathname) => {
	let activeKey

	const searchHelper = (links, pathname) => {
		for (const link of links) {
			if (pathname.includes(link.slug)) {
				activeKey = link.eventKey
			}

			if (link.sublinks && link.sublinks.length > 0) {
				searchHelper(link.sublinks, pathname)
			}
		}
	}

	searchHelper(links, pathname)

	return activeKey
}

const findCategoryByIdWithAncestors = (
	categories,
	id,
	ancestors = []
) => {
	for (const category of categories) {
		if (category.id === id) {
			return [...ancestors, category]
		}

		if (category.children && category.children.length > 0) {
			const result = findCategoryByIdWithAncestors(
				category.children,
				id,
				[...ancestors, category]
			)
			if (result.length > ancestors.length) {
				// If the category is found in children, return the result
				return result
			}
		}
	}

	// If the category is not found
	return []
}

export const groupProductsByTopLevelCategory = (
	products,
	categories
) => {
	const groupedProducts = []

	// console.log(categories)

	// Loop through each product
	for (const product of products) {
		// Find the top-level category for the product
		const topLevelCategory = findCategoryByIdWithAncestors(
			categories,
			product.category._id
		)[0]

		// 	// Use the top-level category ID as the key for grouping
		// 	const key = topLevelCategory[0].name

		// 	// Add the product to the corresponding group
		// 	if (!groupedProducts[key]) {
		// 		groupedProducts[key] = []
		// 	}
		// 	groupedProducts[key].push(product)
		// }

		// return groupedProducts

		// Check if the category is already in the groupedProducts array
		const existingGroup = groupedProducts.find(
			group => group.category === topLevelCategory.name
		)

		// If the category is not in the array, add it with an array of products
		if (!existingGroup) {
			groupedProducts.push({
				category: topLevelCategory.name,
				products: [product],
			})
		} else {
			// If the category is already in the array, add the product to its products array
			existingGroup.products.push({
				...product,
			})
		}
	}

	return groupedProducts
}

export const lineClamp = (str, maxLength) => {
	// Check if the length of the string is greater than the maximum length
	if (str.length > maxLength) {
		// Truncate the string to the maximum length and add an ellipsis
		return str.substring(0, maxLength) + '...'
	} else {
		// Return the original string
		return str
	}
}

export const genFullName = (firstName, lastName) => {
	const fullName =
		lastName === '' ? firstName : firstName + ' ' + lastName

	return fullName
}

export const calculateCartTotal = products => {
	// Initialize total
	let total = 0

	// Iterate over each item in the cart
	products.forEach(product => {
		// Multiply price by quantity and add to total
		total += product.price * product.quantity
	})

	// Return the total
	return total
}

export const getVideoThumbnail = file => {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video')
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')

		video.preload = 'metadata'
		video.src = URL.createObjectURL(file)
		video.muted = true
		video.playsInline = true

		video.addEventListener('loadeddata', () => {
			video.currentTime = 0
		})

		video.addEventListener('seeked', () => {
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
			const thumbnail = canvas.toDataURL('image/png')
			resolve(thumbnail)
		})

		video.addEventListener('error', error => {
			reject(error)
		})
	})
}

export const getVideoThumbnailBlob = file => {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video')
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')

		video.preload = 'metadata'
		video.src = URL.createObjectURL(file)
		video.muted = true
		video.playsInline = true

		video.addEventListener('loadeddata', () => {
			video.currentTime = 0
		})

		video.addEventListener('seeked', () => {
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

			canvas.toBlob(blob => {
				blob.name = file.name.split('.')[0] + '.png'
				resolve(blob)
			}, 'image/png')
		})

		video.addEventListener('error', error => {
			reject(error)
		})
	})
}

const populateParents = async doc => {
	if (!doc || !doc.parent) return doc

	const populatedDoc = await doc.populate('parent')
	populatedDoc.parent = await populateParents(populatedDoc.parent)

	return populatedDoc
}

export const getPopulatedDocs = async docs => {
	const populatedDocs = await Promise.all(
		docs.map(async doc => {
			return await populateParents(doc)
		})
	)

	return populatedDocs
}

export const displayValidationError = arg => {
	if (!arg) return null
	if (typeof arg === 'string') return arg
	if (arg.hasError) return arg.errorMessage
}

export const processFormErrors = (e, formError) => {
	const parentKeys = Object.keys(e) //grab parent keys from error object
	let preparedData = { ...formError } // copy formError object into new object

	parentKeys.forEach(parentKey => {
		// loop through each parent key and update individual properties of
		// the new object based on the parentKey
		if (
			typeof e[parentKey] === 'string' ||
			!e[parentKey].hasOwnProperty('object')
		) {
			// handle non-nested fields
			preparedData[parentKey] = e[parentKey]
		}

		if (e[parentKey].hasOwnProperty('object')) {
			// handle nested fields

			const childKeys = Object.keys(e[parentKey].object) // grab the keys of children

			if (!preparedData[parentKey]) {
				// create an empty object within the new object if it doesn't exist
				preparedData[parentKey] = {}
			}

			// set a hasError property on the empty object and set the value
			// if there is already a hasError property, update it
			// preparedData[parentKey].hasError = e[parentKey].hasError

			if (!preparedData[parentKey].object) {
				// if the object does not contain a property named object, set it to an empty object
				preparedData[parentKey].object = {}
			}

			childKeys.forEach(childKey => {
				preparedData[parentKey].object[childKey] =
					e[parentKey].object[childKey]
			})
		}
	})

	return preparedData
}

// Format orders
export const formatOrder = order => {
	const { percentage, ...rest } = order.discount

	const total = calculateCartTotal(order.products)
	const discount = (percentage / 100) * total
	const equivalent = discount * order.rate

	return {
		...order,
		discount: {
			...rest,
			type: 'percentage',
			value: percentage,
			equivalent,
		},
	}
}
