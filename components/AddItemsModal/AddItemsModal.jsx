'use client'
import { useProducts } from '@/hooks/useProducts'
import {
	selectAllCartItems,
	setItems,
} from '@/redux/features/cart/cartSlice'
import { selectAllCategories } from '@/redux/features/categories/categoriesSlice'
import { getCurrentRate } from '@/redux/features/orders/ordersSlice'
import {
	groupCategories,
	lineClamp,
	roundMoney,
} from '@/utils/functions'

import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import SearchIcon from '@rsuite/icons/Search'
import Image from 'next/image'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	Button,
	Checkbox,
	HStack,
	Input,
	InputGroup,
	List,
	Modal,
	Panel,
	PanelGroup,
	Stack,
	Tag,
	Text,
	Tooltip,
	VStack,
	Whisper,
} from 'rsuite'

const AddItemsModal = ({ open, handleClose }) => {
	const dispatch = useDispatch()
	const categories = useSelector(selectAllCategories)
	const rate = useSelector(getCurrentRate)
	const cartItems = useSelector(selectAllCartItems)
	const [selectedProducts, setSelectedProducts] = useState([])

	const groupedCategories = groupCategories(categories)
	const [results, loading, searchProducts] = useProducts(
		[],
		groupedCategories
	)

	const loadItems = items => {
		setSelectedProducts(items)
	}

	const handleSelected = data => {
		if (data.count === 0) return
		const exists = selectedProducts.find(
			product =>
				product?.product?._id === data._id || product._id === data._id
		)

		if (exists) {
			const filtered = selectedProducts
				.map(item => {
					if (item.hasOwnProperty('quantity')) {
						return item.product
					}
					return item
				})
				.filter(item => item._id !== data._id)
			setSelectedProducts(filtered)
		} else {
			setSelectedProducts(prev => [...prev, data])
		}
	}

	const handleChecked = (checked, data) => {
		if (checked) {
			setSelectedProducts(prev => {
				return [...prev, data]
			})
		} else {
			const filtered = selectedProducts
				.map(item => {
					if (item.hasOwnProperty('quantity')) {
						return item.product
					}
					return item
				})
				.filter(item => item._id !== data._id)
			setSelectedProducts(filtered)
		}
	}

	const handleAdd = () => {
		dispatch(setItems(selectedProducts))
		handleClose()
	}

	return (
		<Modal
			overflow={true}
			open={open}
			onClose={handleClose}
			backdrop='static'
			size='md'
			onEnter={() => loadItems(cartItems)}
		>
			<Modal.Header>
				<Modal.Title>Add items</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ paddingRight: 14, marginBottom: 14 }}>
				<InputGroup inside>
					<InputGroup.Addon>
						<SearchIcon />
					</InputGroup.Addon>
					<Input
						placeholder='Search products'
						onChange={searchProducts}
						style={{ width: '100%' }}
						autoFocus
					/>
					<InputGroup.Addon>
						{loading && <SpinnerIcon spin />}
					</InputGroup.Addon>
				</InputGroup>

				<VStack
					alignItems='stretch'
					spacing={20}
					style={{ marginTop: '1.5em' }}
				>
					{results.length > 0 ? (
						results.map(result => (
							<VStack
								key={result.category}
								alignItems='stretch'
								spacing={10}
							>
								<Text weight='semibold' size='lg'>
									{result.category}
								</Text>
								<List hover>
									{result.products.map(product => (
										<List.Item
											onClick={() => handleSelected(product)}
											key={product._id}
											style={{
												display: 'block',
												cursor: product.count > 0 ? 'pointer' : 'not-allowed',
												paddingRight: 15,
											}}
										>
											<HStack justifyContent='space-between' alignItems='center'>
												<HStack>
													<Checkbox
														onChange={(value, checked) =>
															handleChecked(checked, product)
														}
														checked={selectedProducts
															.map(item => item?.product?._id || item._id)
															.includes(product._id)}
														disabled={product.count === 0}
														style={{ pointerEvents: 'none' }}
													/>

													<HStack spacing={15}>
														<div
															style={{
																position: 'relative',
																height: 40,
																width: 40,
																objectFit: 'contain',
															}}
														>
															<Image
																src={product.images[0].url}
																alt={product.title}
																fill
																sizes='(max-width: 768px) 40px, (max-width: 1200px) 40px, 40px'
															/>
														</div>

														<VStack>
															<span style={{ color: '#6CD6FF', fontSize: 13 }}>
																{product.title} ({product.count})
															</span>
															<span style={{ fontSize: 11 }}>
																{product.brand.name}
															</span>
														</VStack>
													</HStack>
												</HStack>

												<span style={{ fontSize: 13 }}>
													GHS {roundMoney(product.sellPrice * rate)}
												</span>
											</HStack>
										</List.Item>
									))}
								</List>
							</VStack>
						))
					) : (
						<HStack justifyContent='center'>
							<Text muted size={13}>
								No products found.
							</Text>
						</HStack>
					)}
				</VStack>
			</Modal.Body>
			<Modal.Footer>
				<Stack justifyContent='space-between'>
					<Stack alignItems='center' spacing={7} wrap>
						{selectedProducts.map(item => (
							<Whisper
								placement='top'
								trigger='hover'
								speaker={
									<Tooltip>{item?.product?.title || item.title}</Tooltip>
								}
								key={item?.product?._id || item._id}
							>
								<Tag
									closable
									onClose={() => handleChecked(false, item?.product || item)}
								>
									{lineClamp(item?.product?.title || item.title, 20)}
								</Tag>
							</Whisper>
						))}
					</Stack>

					<Stack spacing={10}>
						<Button
							onClick={handleAdd}
							appearance='primary'
							size='sm'
							disabled={selectedProducts.length === 0}
						>
							Done
						</Button>
						<Button onClick={handleClose} appearance='subtle' size='sm'>
							Cancel
						</Button>
					</Stack>
				</Stack>
			</Modal.Footer>
		</Modal>
	)
}
export default AddItemsModal
