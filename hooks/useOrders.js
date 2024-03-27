import { fetcher } from '@/utils/functions'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const useOrders = (defaultOrders = []) => {
	const [orders, setOrders] = useState(defaultOrders)
	const [loading, setLoading] = useState(false)

	// const searchOrders = useDebouncedCallback(async query => {
	// 	if (query.length > 2) {
	// 		setLoading(true)
	// 		const { data, status, message } = await fetcher(
	// 			`/api/users/search?q=${query}`
	// 		)

	// 		setLoading(false)

	// 		if (status === 'success') {
	// 			const formatted = data.map(user => {
	// 				return {
	// 					...user,
	// 					label:
	// 						user.lastName === ''
	// 							? user.firstName
	// 							: user.firstName + ' ' + user.lastName,
	// 					value: user._id,
	// 				}
	// 			})
	// 			setUsers(formatted)
	// 		} else {
	// 			console.log('Could not fetch users.')
	// 		}
	// 	} else {
	// 		setUsers([])
	// 	}
	// }, 300)

	// return [orders, loading, searchOrders]
}
