'use client'

import { selectAllDisabledProducts } from '@/redux/features/products/productsSlice'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { Message } from 'rsuite'

const DisabledProductsNotification = () => {
	const products = useSelector(selectAllDisabledProducts)

	if (products.length > 0)
		return (
			<Message full showIcon type='warning' closable>
				There are some products with missing mandatory fields. Customers
				will not see these products until these fields are provided.{' '}
				<Link href='products/disabled'>View Products</Link>
			</Message>
		)
	return
}
export default DisabledProductsNotification
