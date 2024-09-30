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
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	Button,
	Checkbox,
	Col,
	Form,
	Grid,
	HStack,
	Input,
	InputGroup,
	InputNumber,
	List,
	Modal,
	Panel,
	PanelGroup,
	Row,
	Schema,
	Stack,
	Tabs,
	Tag,
	Text,
	Tooltip,
	VStack,
	Whisper,
} from 'rsuite'
import Field from '../Field/Field'
import { toast } from 'react-toastify'

const { StringType, NumberType } = Schema.Types

const model = Schema.Model({
	title: StringType().isRequired('You must provide a title.'),
	sellPrice: NumberType()
		.min(1, 'Price can not be 0')
		.isRequired('You must provide a price.'),
})

const AddItemsModal = ({ open, handleClose }) => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		_id: Date.now(),
		title: '',
		sellPrice: 1.0,
		brand: {
			name: 'BS42.NET',
		},
	})
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

	// const handleChecked = (checked, data) => {
	// 	if (checked) {
	// 		setSelectedProducts(prev => {
	// 			return [...prev, data]
	// 		})
	// 	} else {
	// 		const filtered = selectedProducts
	// 			.map(item => {
	// 				if (item.hasOwnProperty('quantity')) {
	// 					return item.product
	// 				}
	// 				return item
	// 			})
	// 			.filter(item => item._id !== data._id)
	// 		setSelectedProducts(filtered)
	// 	}
	// }

	const handleAdd = () => {
		dispatch(setItems(selectedProducts))
		handleClose()
	}

	const handleSubmit = () => {
		if (!formRef.current.check()) {
			return
		}

		const exists = selectedProducts.find(
			product =>
				product?.product?.title === formValue.title ||
				product.title === formValue.title
		)

		if (exists) return toast.error('Item with that name already exists')

		setFormValue({
			_id: Date.now(),
			title: '',
			sellPrice: 1.0,
			brand: {
				name: 'BS42.NET',
			},
		})
		setSelectedProducts(prev => [
			...prev,
			{ ...formValue, sellPrice: formValue.sellPrice / rate },
		])
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
			{/* <Modal.Header
				closeButton={false}
				style={{
					paddingTop: '1em',
					paddingLeft: '1em',
					paddingRight: '1em',
				}}
			>
				<HStack>
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
				</HStack>
			</Modal.Header> */}
			<Modal.Body
				style={{
					marginBottom: 5,
					// paddingLeft: '1em',
					// paddingRight: '1em',
				}}
			>
				<Tabs defaultActiveKey='1'>
					<Tabs.Tab eventKey='1' title='Search'>
						<Panel header='Search and add item(s)' bordered>
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
														<HStack
															justifyContent='space-between'
															alignItems='center'
														>
															<HStack>
																<Checkbox
																	// onChange={(value, checked) =>
																	// 	handleChecked(checked, product)
																	// }
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
						</Panel>
					</Tabs.Tab>
					<Tabs.Tab eventKey='2' title='Create'>
						<Panel header='Create custom item' bordered>
							<Form
								ref={formRef}
								onChange={setFormValue}
								onCheck={setFormError}
								formValue={formValue}
								model={model}
							>
								<Grid fluid>
									<Row style={{ marginBottom: '1em' }}>
										<Col xs={16}>
											<Field
												name='title'
												label='Title'
												accepter={Input}
												error={formError.title}
											/>
										</Col>
										<Col xs={8}>
											<Field
												name='sellPrice'
												label='Price'
												step={0.1}
												formatter={value => `GHS ${value}`}
												accepter={InputNumber}
												error={formError.sellPrice}
											/>
										</Col>
									</Row>
									<Row>
										<Col
											xs={24}
											style={{ display: 'flex', justifyContent: 'flex-end' }}
										>
											<Button block appearance='primary' onClick={handleSubmit}>
												Add item
											</Button>
										</Col>
									</Row>
								</Grid>
							</Form>
						</Panel>
					</Tabs.Tab>
				</Tabs>
			</Modal.Body>
			<Modal.Footer
				style={{
					paddingBottom: '1em',
					// paddingLeft: '1em',
					// paddingRight: '1em',
				}}
			>
				<VStack spacing={30}>
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
									onClose={() => handleSelected(item?.product || item)}
								>
									{lineClamp(item?.product?.title || item.title, 20)}
								</Tag>
							</Whisper>
						))}
					</Stack>

					<HStack justifyContent='flex-end' style={{ width: '100%' }}>
						<HStack spacing={0}>
							<Button
								onClick={handleAdd}
								appearance='primary'
								size='sm'
								disabled={selectedProducts.length === 0}
							>
								Done
							</Button>
							<Button onClick={handleClose} appearance='default' size='sm'>
								Cancel
							</Button>
						</HStack>
					</HStack>
				</VStack>
			</Modal.Footer>
		</Modal>
	)
}
export default AddItemsModal
