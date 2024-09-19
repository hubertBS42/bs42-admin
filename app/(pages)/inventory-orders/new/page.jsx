'use client'

import AddItemsModal from '@/components/AddItemsModal/AddItemsModal'
import NewInventoryOrderForm from '@/components/NewInventoryOrderForm/NewInventoryOrderForm'
import { emptyCart } from '@/redux/features/cart/cartSlice'
import { loadAllCategories } from '@/redux/features/categories/categoriesActions'
import { loadCurrentRate } from '@/redux/features/orders/ordersActions'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const NewInventoryOrderPage = () => {
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
			<NewInventoryOrderForm handleModalOpen={handleModalOpen} />
		</>
	)
}
export default NewInventoryOrderPage
