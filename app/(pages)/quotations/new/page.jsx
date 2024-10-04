'use client'

import { useEffect, useState } from 'react'
import AddItemsModal from '@/components/AddItemsModal/AddItemsModal'
import { loadAllCategories } from '@/redux/features/categories/categoriesActions'
import { loadCurrentRate } from '@/redux/features/orders/ordersActions'
import NewQuotationForm from '@/components/NewQuotationForm/NewQuotationForm'
import { useDispatch } from 'react-redux'
import { emptyCart } from '@/redux/features/cart/cartSlice'

const NewQuotationPage = () => {
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
			<NewQuotationForm handleModalOpen={handleModalOpen} />
		</>
	)
}
export default NewQuotationPage
