import { usePathname } from 'next/navigation'
import { format, isAfter, isBefore, parseISO } from 'date-fns'
import Order from '@/models/Order'
import { connectToDB } from './database'

const capitalizeFirstLetter = word => {
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

	if (choppedUp.includes('add')) {
		const firstWord = capitalizeFirstLetter(choppedUp.pop())

		const capitalized = capitalizeFirstLetter(choppedUp.pop())
		const secondWord = removeLastLetter(capitalized)

		return `${firstWord} ${secondWord}`
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

export const formatDate = date => new Date(date).toDateString()

export const formatData = data => {
	return data?.map(item => ({
		label: item.title ? item.title : item.name,
		value: item._id,
	}))
}

export const getDisabledItems = data => {
	return data?.filter(item => !item.isActive).map(item => item._id)
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
			description: category.description,
			parent: category.parent,
			slug: category.slug,
			images: category.images,
			isActive: category.isActive,
			createdAt: category.createdAt,
			children: formatCategoriesForTable(categories, category._id),
		}))
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
	return categories
		.filter(category => category.parent === parent)
		.map(category => ({
			value: category._id,
			label: category.name,
			children: formatCategoriesForTreePicker(categories, category._id),
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
			children: groupCategories(categories, category._id),
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

export const replacePlaceholders = (inputString, values) => {
	return inputString.replace(/\${(.*?)}/g, (match, placeholder) => {
		// `placeholder` contains the name inside the curly braces
		// `match` contains the full matched string, including the curly braces
		return values[placeholder.trim()] || match
	})
}

// Function to generate date-based invoice numbers
export const generateInvoiceNumber = () => {
	const today = new Date()
	const year = today.getFullYear()
	const month = String(today.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
	const day = String(today.getDate()).padStart(2, '0')

	// Get the last used number for the current date, from a database or storage
	// Here, we'll just use a simple increment for demonstration
	let lastInvoiceNumber = 1 // Initialize to 1 or retrieve from storage
	lastInvoiceNumber++ // Increment for the next invoice

	// Combine date and number to create the invoice number
	const invoiceNumber = `INV${year}${month}${day}-${String(
		lastInvoiceNumber
	).padStart(3, '0')}`

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
