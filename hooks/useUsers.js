import { fetcher } from '@/utils/functions'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const useUsers = (defaultUsers = []) => {
	const [users, setUsers] = useState(defaultUsers)
	const [loading, setLoading] = useState(false)

	const searchUsers = useDebouncedCallback(async query => {
		if (query.length > 2) {
			setLoading(true)
			const { data, status, message } = await fetcher(
				`/api/users/search?q=${query}`
			)

			setLoading(false)

			if (status === 'success') {
				const formatted = data.map(user => {
					return {
						...user,
						label:
							user.lastName === ''
								? user.firstName
								: user.firstName + ' ' + user.lastName,
						value: user._id,
					}
				})
				setUsers(formatted)
			} else {
				console.log('Could not fetch users.')
			}
		} else {
			setUsers([])
		}
	}, 300)

	return [users, loading, searchUsers]
}
