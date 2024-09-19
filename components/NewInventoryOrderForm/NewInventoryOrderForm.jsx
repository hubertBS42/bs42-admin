'use client'
import Link from 'next/link'
import { useState } from 'react'

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
	modifyItem,
	removeItem,
	selectAllCartItems,
	totalBuyPriceSelector,
} from '@/redux/features/cart/cartSlice'
import Image from 'next/image'
import { roundMoney } from '@/utils/functions'
import AddBuyShippingPopover from '../AddBuyShippingPopper/AddBuyShippingPopover'
import { useSuppliers } from '@/hooks/useSuppliers'
import InventoryOrderStatusPanel from '../InventoryOrderStatusPanel/InventoryOrderStatusPanel'
import { createInventoryOrder } from '@/redux/features/inventoryOrders/inventoryOrdersActions'

const NewInventoryOrderForm = ({ handleModalOpen }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [suppliers, loading, searchSuppliers] = useSuppliers()
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

	const dispatch = useDispatch()

	const handleSubmit = async e => {
		e.preventDefault()

		setIsLoading(true)

		const preparedData = {
			...formValue,
			supplier: supplier._id,
			products: items.map(item => ({
				...item,
				product: item.product._id,
				price: item.product.buyPrice,
			})),
			subtotal: cartPriceTotal,
			total: cartPriceTotal + formValue.shippingCost,
		}

		await createInventoryOrder(preparedData)
		setIsLoading(false)
	}

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
														value={item.product.buyPrice}
														step={0.1}
														formatter={value => `$ ${value}`}
														onChange={value => {
															dispatch(
																modifyItem({
																	product: {
																		...item.product,
																		buyPrice: Number(value),
																	},
																	quantity: item.quantity,
																})
															)
														}}
														style={{ width: 100 }}
														size='sm'
														disabled={isLoading}
													/>

													<span style={{ display: 'flex', width: 100 }}>
														${roundMoney(item.product.buyPrice * item.quantity)}
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
									onPreview={file => console.log(file)}
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
							<PanelGroup bordered>
								<Panel
									header={
										<Stack justifyContent='space-between'>
											<span>Supplier</span>
											<Button
												appearance='link'
												size='sm'
												style={{ padding: 0 }}
												onClick={() => setSupplier(null)}
												disabled={isLoading}
											>
												Discard
											</Button>
										</Stack>
									}
								>
									<Stack spacing={17} style={{ fontSize: 15 }}>
										<div
											style={{
												position: 'relative',
												height: 80,
												width: 80,
												objectFit: 'cover',
												borderRadius: '50%',
												overflow: 'hidden',
											}}
										>
											<Image
												src={supplier?.logo?.url || '/images/profile.png'}
												alt={supplier.name}
												fill
												sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
											/>
										</div>
										<Stack direction='column' alignItems='flex-start'>
											<a
												target='_blank'
												style={{ color: '#6CD6FF' }}
												href={supplier?.website?.company || ''}
											>
												{supplier.name}
											</a>
											<span style={{ color: '#D4D4D4', fontSize: 13 }}>
												{supplier?.contact?.email}
											</span>
											<span style={{ color: '#D4D4D4', fontSize: 13 }}>
												{supplier?.contact?.primaryPhone}
											</span>
										</Stack>
									</Stack>
								</Panel>

								<Panel header='Contact'>
									<Stack
										direction='column'
										alignItems='flex-start'
										style={{ color: '#D4D4D4', fontSize: 13 }}
									>
										<HStack>
											<AdminIcon />
											<HStack spacing={3}>
												<span>{supplier?.contact?.firstName}</span>
												<span>{supplier?.contact?.lastName}</span>
											</HStack>
										</HStack>
										<HStack>
											<EmailIcon />
											<span>{supplier?.contact?.email}</span>
										</HStack>
										<HStack>
											<PhoneIcon />
											<span>{supplier?.contact?.primaryPhone}</span>
										</HStack>
									</Stack>
								</Panel>

								<Panel header='Address'>
									<HStack alignItems='flex-start'>
										<LocationIcon />
										<VStack
											style={{ color: '#D4D4D4', fontSize: 13 }}
											spacing={0}
										>
											<span>{supplier?.address?.line1}</span>
											<span>{supplier?.address?.line2}</span>
											<span>{supplier?.address?.townCity}</span>
											<span>{supplier?.address?.country}</span>
										</VStack>
									</HStack>
								</Panel>
							</PanelGroup>
						)}

						<Stack justifyContent='flex-end' style={{ marginTop: '1em' }}>
							<ButtonToolbar>
								<Button
									appearance='primary'
									onClick={handleSubmit}
									// disabled={enableSubmit}
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
