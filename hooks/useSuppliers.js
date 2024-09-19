import { fetcher } from '@/utils/functions'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const useSuppliers = (defaultSuppliers = []) => {
	const [suppliers, setSuppliers] = useState(defaultSuppliers)
	const [loading, setLoading] = useState(false)
	const [controller, setController] = useState(null)

	const searchSuppliers = useDebouncedCallback(async query => {
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
					`/api/suppliers/search?q=${query}`,
					{ signal }
				)

				if (status === 'success') {
					setSuppliers(data)
				} else {
					console.log('Could not fetch suppliers.')
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
			setSuppliers([])
			if (controller) {
				controller.abort()
			}
		}
	}, 300)

	return [suppliers, loading, searchSuppliers]
}
