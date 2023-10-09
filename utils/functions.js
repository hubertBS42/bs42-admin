import { usePathname } from 'next/navigation'

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

	return capitalizeFirstLetter(choppedUp.pop())
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
