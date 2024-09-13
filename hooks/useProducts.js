import {
	fetcher,
	groupProductsByTopLevelCategory,
} from '@/utils/functions'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const useProducts = (defaultProducts, categories) => {
	const [results, setResults] = useState(defaultProducts)
	const [loading, setLoading] = useState(false)
	const [controller, setController] = useState(null)

	const searchProducts = useDebouncedCallback(async query => {
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
					`/api/frontend/products/search?q=${query}`,
					{ signal }
				)

				if (status === 'success') {
					const groupedProducts = groupProductsByTopLevelCategory(
						data,
						categories
					)

					setResults(groupedProducts)
				} else {
					console.log('Could not fetch products.')
				}
			} catch (error) {
				if (error.name === 'AbortError') {
					console.log('Fetch aborted')
				} else {
					console.error('Error fetching products:', error)
				}
			} finally {
				setLoading(false)
			}
		}

		if (query.length <= 2) {
			setResults([])
			if (controller) {
				controller.abort()
			}
		}
	}, 300)

	return [results, loading, searchProducts]
}
