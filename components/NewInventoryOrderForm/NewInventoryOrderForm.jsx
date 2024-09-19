'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import SearchIcon from '@rsuite/icons/Search'
import TrashIcon from '@rsuite/icons/Trash'
import AdminIcon from '@rsuite/icons/Admin'
import EmailIcon from '@rsuite/icons/Email'
import PhoneIcon from '@rsuite/icons/Phone'
import LocationIcon from '@rsuite/icons/Location'

import {
	Button,
	ButtonToolbar,
	Col,
	Form,
	Grid,
	HStack,
	InputNumber,
	InputPicker,
	Panel,
	PanelGroup,
	Row,
	Stack,
	Text,
	Uploader,
	VStack,
} from 'rsuite'
import { useDispatch, useSelector } from 'react-redux'
import {
	emptyCart,
	modifyItem,
	removeItem,
	selectAllCartItems,
	totalBuyPriceSelector,
} from '@/redux/features/cart/cartSlice'
import Image from 'next/image'
import { fetcher, roundMoney } from '@/utils/functions'
import AddBuyShippingPopover from '../AddBuyShippingPopper/AddBuyShippingPopover'
import { useSuppliers } from '@/hooks/useSuppliers'
import InventoryOrderStatusPanel from '../InventoryOrderStatusPanel/InventoryOrderStatusPanel'
import { createInventoryOrder } from '@/redux/features/inventoryOrders/inventoryOrdersActions'
import { getSession } from 'next-auth/react'
import { selectAllCategories } from '@/redux/features/categories/categoriesSlice'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { updateFiles } from '@/utils/azure'
import SupplierCard from '../SupplierCard/SupplierCard'

const NewInventoryOrderForm = ({ handleModalOpen }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [suppliers, loading, searchSuppliers] = useSuppliers()
	const [enableSubmit, setEnableSubmit] = useState(false)
	const [supplier, setSupplier] = useState(null)
	const [formValue, setFormValue] = useState({
		supplier: '',
		products: [],
		files: [],
		shippingCost: 0,
		subtotal: 0,
		total: 0,
		status: ['created'],
	})

	const items = useSelector(selectAllCartItems)
	const cartPriceTotal = useSelector(totalBuyPriceSelector)
	const categories = useSelector(selectAllCategories)

	const dispatch = useDispatch()

	const handleSubmit = async e => {
		e.preventDefault()

		setIsLoading(true)

		const session = await getSession()
		const userID = session?.user.id
		let uploadedFiles = []

		const filesToBeUploaded = formValue.files.map(file => file.blobFile)

		if (filesToBeUploaded.length > 0) {
			uploadedFiles = await updateFiles(filesToBeUploaded, [])
		}

		const formattedStatus = formValue.status.map(event => ({
			type: event,
			timestamp: new Date().toISOString(),
		}))

		const fetchCategories = id => {
			const category = categories.find(category => category._id === id)
			return [
				category?.name,
				category?.parent?.name,
				category?.parent?.parent?.name,
			]
		}

		const preparedData = {
			...formValue,
			supplier: supplier._id,
			user: userID,
			files: uploadedFiles,
			products: items.map(item => ({
				productRef: item.product._id,
				title: item.product.title,
				brand: { name: item.product.brand.name },
				category: fetchCategories(item.product.category._id),
				images: item.product.images,
				quantity: item.quantity,
				buyPrice: item.buyPrice,
			})),
			status: formattedStatus,
			subtotal: cartPriceTotal,
			total: cartPriceTotal + formValue.shippingCost,
		}

		const {
			status,
			message,
			data: inventoryOrder,
		} = await fetcher('/api/inventory-orders/add', {
			method: 'POST',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		if (status === 'success') {
			router.push(`/inventory-orders/${inventoryOrder.orderNumber}`)
			toast.success('Inventory order created.')
			dispatch(emptyCart())
		} else {
			console.log(message)
			toast.error('Failed to create order.')
		}

		setIsLoading(false)
	}

	useEffect(() => {
		const handleEnableSubmit = () => {
			const productsAdded = items.length > 0
			const supplierAdded = supplier

			if (productsAdded && supplierAdded) {
				setEnableSubmit(true)
			} else {
				setEnableSubmit(false)
			}
		}

		handleEnableSubmit()
	}, [items, supplier])

	return (
		<Form disabled={isLoading}>
			<Grid fluid>
				<Row style={{ marginBottom: 10 }}>
					<Col xs={24}>
						<InventoryOrderStatusPanel
							status={formValue.status}
							setFormValue={setFormValue}
							newOrder
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={16}>
						<PanelGroup bordered>
							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Order items</span>
										<Button
											appearance='link'
											size='sm'
											style={{ padding: 0 }}
											onClick={handleModalOpen}
											disabled={isLoading}
										>
											Add item
										</Button>
									</Stack>
								}
							>
								{items.length > 0 ? (
									items.map(item => (
										<Row key={item.product._id}>
											<Col xs={24} style={{ marginBottom: 20 }}>
												<Stack
													justifyContent='space-between'
													alignItems='center'
													style={{ fontSize: 12, color: '#D4D4D4' }}
												>
													<Stack spacing={15} style={{ width: 360 }}>
														<div
															style={{
																position: 'relative',
																height: 60,
																width: 60,
																objectFit: 'contain',
															}}
														>
															<Image
																src={item.product.images[0].url}
																alt={item.product.title}
																fill
																sizes='(max-width: 768px) 60px, (max-width: 1200px) 60px, 60px'
															/>
														</div>
														<Stack direction='column' alignItems='flex-start'>
															<span style={{ color: '#6CD6FF' }}>
																{item.product.title}
															</span>
															<span>{item.product.brand.name}</span>
														</Stack>
													</Stack>

													<InputNumber
														value={item.quantity}
														defaultValue={1}
														onChange={value =>
															dispatch(
																modifyItem({
																	product: item.product,
																	quantity: Number(value),
																	buyPrice: item.buyPrice,
																})
															)
														}
														style={{ width: 65 }}
														size='sm'
														max={item.product.count}
														disabled={isLoading}
													/>

													<span>x</span>

													<InputNumber
														value={item.buyPrice}
														step={0.1}
														formatter={value => `$ ${value}`}
														onChange={value => {
															dispatch(
																modifyItem({
																	product: item.product,
																	quantity: item.quantity,
																	buyPrice: Number(value),
																})
															)
														}}
														style={{ width: 100 }}
														size='sm'
														disabled={isLoading}
													/>

													<span style={{ display: 'flex', width: 100 }}>
														${roundMoney(item.buyPrice * item.quantity)}
													</span>

													<Button
														appearance='link'
														color='red'
														style={{ padding: 0 }}
														onClick={() => dispatch(removeItem(item.product))}
														disabled={isLoading}
													>
														<TrashIcon />
													</Button>
												</Stack>
											</Col>
										</Row>
									))
								) : (
									<Stack
										direction='column'
										spacing={20}
										style={{ margin: '50px 0' }}
									>
										<Text muted align='center'>
											Items have not been added to this order.
										</Text>
										<Button
											appearance='primary'
											size='xs'
											onClick={handleModalOpen}
											disabled={isLoading}
										>
											Add item
										</Button>
									</Stack>
								)}

								<Row style={{ marginTop: 30 }}>
									<Col xs={14}>
										{/* <Text style={{ marginBottom: 5 }}>Notes:</Text>
										<Input
											as='textarea'
											placeholder='Add a note...'
                      name={formValue.notes}
											// value={orderDetails.notes}
											onChange={notes =>
												setFormValue(prev => ({ ...prev, notes }))
											}
											disabled={isLoading}
										/> */}
									</Col>

									<Col xs={10} style={{ fontSize: 12, color: '#D4D4D4' }}>
										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<Text>Subtotal</Text>
											</Col>
											<Col xs={15}>
												<Text>${roundMoney(cartPriceTotal)}</Text>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<AddBuyShippingPopover
													formValue={formValue}
													setFormValue={setFormValue}
													isLoading={isLoading}
												/>
											</Col>
											<Col xs={15}>
												<Text>${roundMoney(formValue.shippingCost)}</Text>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right' }}>
											<Col xs={9}>
												<Text>Total</Text>
											</Col>
											<Col xs={15}>
												<Text>
													${roundMoney(cartPriceTotal + formValue.shippingCost)}
												</Text>
											</Col>
										</Row>
									</Col>
								</Row>
							</Panel>
							<Panel header='Files'>
								<Uploader
									action=''
									draggable
									autoUpload={false}
									fileList={formValue.files}
									multiple
									onChange={files =>
										setFormValue(prev => ({ ...prev, files }))
									}
								>
									<div
										style={{
											height: 200,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<span>Click or Drag files to this area to upload</span>
									</div>
								</Uploader>
							</Panel>

							<Panel header='Comments'></Panel>
						</PanelGroup>
					</Col>
					<Col xs={8}>
						{!supplier ? (
							<Panel bordered header='Add supplier'>
								<InputPicker
									onSearch={searchSuppliers}
									placeholder='Find supplier'
									data={suppliers.map(supplier => {
										return {
											label: supplier.name,
											value: JSON.stringify(supplier),
										}
									})}
									onSelect={value => {
										const data = JSON.parse(value)
										setSupplier(data)
									}}
									block
									renderMenu={menu => {
										if (loading) {
											return (
												<p
													style={{
														padding: 10,
														color: '#999',
														textAlign: 'center',
													}}
												>
													<SpinnerIcon spin /> Loading...
												</p>
											)
										}
										return menu
									}}
								/>
							</Panel>
						) : (
							<SupplierCard
								supplier={supplier}
								isLoading={isLoading}
								setSupplier={setSupplier}
								newOrder
							/>
						)}

						<Stack justifyContent='flex-end' style={{ marginTop: '1em' }}>
							<ButtonToolbar>
								<Button
									appearance='primary'
									onClick={handleSubmit}
									disabled={!enableSubmit}
									loading={isLoading}
								>
									Create order
								</Button>
								<Button
									as={Link}
									href='/inventory-orders'
									disabled={isLoading}
								>
									Cancel
								</Button>
							</ButtonToolbar>
						</Stack>
					</Col>
				</Row>
			</Grid>
		</Form>
	)
}
export default NewInventoryOrderForm
