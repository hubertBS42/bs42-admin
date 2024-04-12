import { fetcher } from '@/utils/functions'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const useUsers = (defaultUsers = []) => {
	const [users, setUsers] = useState(defaultUsers)
	const [loading, setLoading] = useState(false)
	const [controller, setController] = useState(null)

	const searchUsers = useDebouncedCallback(async query => {
		if (query.length > 2) {
			if (controller) {
				controller.abort()
			}
			setLoading(true)
			const newController = new AbortController()
			setController(newController)

			try {
				const { signal } = newController
				const { data, status, message } = await fetcher(
					`/api/users/search?q=${query}`,
					{ signal }
				)

				if (status === 'success') {
					// const formatted = data.map(user => {
					// 	return {
					// 		...user,
					// 		label:
					// 			user.lastName === ''
					// 				? user.firstName
					// 				: user.firstName + ' ' + user.lastName,
					// 		value: user._id,
					// 	}
					// })
					setUsers(data)
				} else {
					console.log('Could not fetch users.')
				}
			} catch (error) {
				if (error.name === 'AbortError') {
					console.log('Fetch aborted')
				} else {
					console.error('Error fetching users:', error)
				}
			} finally {
				setLoading(false)
			}
		}

		if (query.length <= 2) {
			setUsers([])
			if (controller) {
				controller.abort()
			}
		}
	}, 300)

	return [users, loading, searchUsers]
}
