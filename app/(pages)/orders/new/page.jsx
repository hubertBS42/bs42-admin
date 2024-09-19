'use client'

import { useEffect, useState } from 'react'
import AddItemsModal from '@/components/AddItemsModal/AddItemsModal'
import { loadAllCategories } from '@/redux/features/categories/categoriesActions'
import { loadCurrentRate } from '@/redux/features/orders/ordersActions'
import NewOrderForm from '@/components/NewOrderForm/NewOrderForm'
import { useDispatch } from 'react-redux'
import { emptyCart } from '@/redux/features/cart/cartSlice'

const NewOrderPage = () => {
	const dispatch = useDispatch()
	const [modalOpen, setModalOpen] = useState(false)
	const handleModalClose = () => setModalOpen(false)
	const handleModalOpen = () => setModalOpen(true)

	useEffect(() => {
		dispatch(emptyCart())
		loadAllCategories()
		loadCurrentRate()
	}, [])
	return (
		<>
			<AddItemsModal open={modalOpen} handleClose={handleModalClose} />
			<NewOrderForm handleModalOpen={handleModalOpen} />
		</>
	)
}
export default NewOrderPage
