'use client'
import {
	modifyItem,
	removeItem,
	selectAllCartItems,
	totalCartItemSelector,
	totalPriceSelector,
} from '@/redux/features/cart/cartSlice'
import { roundMoney } from '@/utils/functions'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import {
	Button,
	Col,
	Grid,
	InlineEdit,
	Input,
	InputNumber,
	InputPicker,
	Panel,
	PanelGroup,
	Row,
	Stack,
} from 'rsuite'

import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import SearchIcon from '@rsuite/icons/Search'
import TrashIcon from '@rsuite/icons/Trash'
import { getCurrentRate } from '@/redux/features/orders/ordersSlice'
import { useEffect, useState } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import ManageOrderCustomerDrawer from '../ManageOrderCustomerDrawer/ManageOrderCustomerDrawer'

const NewOrderForm = ({ handleModalOpen }) => {
	const [users, loading, searchUsers] = useUsers()
	const dispatch = useDispatch()
	const items = useSelector(selectAllCartItems)
	const rate = useSelector(getCurrentRate)
	const cartPriceTotal = useSelector(totalPriceSelector)
	const cartItemsTotal = useSelector(totalCartItemSelector)

	const [discount, setDiscount] = useState(0)
	const [shipping, setShipping] = useState(0)
	const [subtotal, setSubtotal] = useState(0)
	const [total, setTotal] = useState(0)
	const [orderValues, setOrderValues] = useState({
		user: '',
		label: '',
		profileImg: null,
		contact: null,
		billing: null,
		shipping: null,
		status: 'pending',
		rate: 0,
		products: [],
		totalPrice: 0,
		payment: {
			method: '',
			status: 'pending',
		},
	})
	const [customer, setCustomer] = useState(null)

	let activeShipping = null

	if (customer) {
		activeShipping = customer?.shipping.find(
			address => address.isActive
		)
	}

	const handleCalculations = () => {
		const discountValue = (Number(discount) / 100) * cartPriceTotal
		const discountDifference = cartPriceTotal - discountValue
		const grandTotal = discountDifference * rate + Number(shipping)
		setSubtotal(discountDifference * rate)
		setTotal(grandTotal)
	}

	useEffect(() => {
		handleCalculations()
	}, [cartItemsTotal])

	return (
		<>
			<ManageOrderCustomerDrawer setCustomer={setCustomer} />
			<Grid fluid>
				<Row>
					<Col xs={16}>
						<PanelGroup bordered>
							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Order details</span>
										<Button
											appearance='link'
											size='sm'
											style={{ padding: 0 }}
											onClick={handleModalOpen}
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

													<span style={{ display: 'flex', width: 100 }}>
														GHS {roundMoney(item.product.sellPrice * rate)}
													</span>

													<span>x</span>

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
														max={item.product.countInStock}
													/>

													<span style={{ display: 'flex', width: 100 }}>
														GHS{' '}
														{roundMoney(
															item.product.sellPrice * item.quantity * rate
														)}
													</span>

													<Button
														appearance='link'
														color='red'
														style={{ padding: 0 }}
														onClick={() => dispatch(removeItem(item.product))}
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
										<p style={{ textAlign: 'center', color: '#D4D4D4' }}>
											Items have not been added to this order.
										</p>
										<Button
											appearance='primary'
											size='xs'
											onClick={handleModalOpen}
										>
											Add item
										</Button>
									</Stack>
								)}

								<Row style={{ marginTop: 30 }}>
									<Col xs={14}>
										<label style={{ display: 'flex', marginBottom: 5 }}>
											Notes:
										</label>
										<Input as='textarea' placeholder='Add a note...' />
									</Col>

									<Col xs={10} style={{ fontSize: 12, color: '#D4D4D4' }}>
										<Row
											style={{
												textAlign: 'right',
												marginBottom: 12,
											}}
										>
											<Col xs={9} style={{ paddingTop: 6 }}>
												<span>Discount (%)</span>
											</Col>
											<Col xs={15}>
												<InlineEdit
													placeholder='--'
													style={{ width: 75 }}
													size='sm'
													className='custom-number'
													onChange={setDiscount}
													onSave={handleCalculations}
												>
													<InputNumber />
												</InlineEdit>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<span>Subtotal (GHS)</span>
											</Col>
											<Col xs={15}>
												<span>{roundMoney(subtotal)}</span>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<span>Shipping (GHS)</span>
											</Col>
											<Col xs={15}>
												<InlineEdit
													placeholder='--'
													size='sm'
													className='custom-number'
													style={{ width: 75 }}
													onChange={setShipping}
													onSave={handleCalculations}
												>
													<InputNumber />
												</InlineEdit>
											</Col>
										</Row>

										{/* <Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
												>
													Taxes (GHS)
												</Button>
											</Col>
											<Col xs={15}>
												<span>0.00</span>
											</Col>
										</Row> */}

										<Row style={{ textAlign: 'right' }}>
											<Col xs={9}>
												<span>Total (GHS)</span>
											</Col>
											<Col xs={15}>
												<span>{roundMoney(total)}</span>
											</Col>
										</Row>
									</Col>
								</Row>
							</Panel>
							<Panel header='Payment method'></Panel>
							<Panel header='Shipment method'></Panel>
						</PanelGroup>
					</Col>
					<Col xs={8}>
						{!customer ? (
							<Panel
								bordered
								header={
									<Stack justifyContent='space-between'>
										<span>Find or create a customer</span>
										<Button
											appearance='link'
											size='sm'
											style={{ padding: 0 }}
											onClick={() => dispatch(setDrawerOpen({ mode: 'add' }))}
										>
											Create customer
										</Button>
									</Stack>
								}
							>
								<InputPicker
									onSearch={searchUsers}
									placeholder='Find customer'
									data={users.map(user => {
										return { label: user.label, value: JSON.stringify(user) }
									})}
									onSelect={value => setCustomer(JSON.parse(value))}
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
											<span>Customer</span>
											<Stack spacing={10}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
													onClick={() =>
														dispatch(
															setDrawerOpen({
																mode: 'edit',
																data: customer,
															})
														)
													}
												>
													Edit
												</Button>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
													onClick={() => setCustomer(null)}
												>
													Cancel
												</Button>
											</Stack>
										</Stack>
									}
								>
									<Stack spacing={17} style={{ fontSize: 15 }}>
										<div
											style={{
												position: 'relative',
												height: 80,
												width: 80,
												objectFit: 'contain',
												borderRadius: '50%',
												overflow: 'hidden',
											}}
										>
											<Image
												src={customer?.profileImg?.url || '/images/profile.png'}
												alt={customer.label}
												fill
												sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
											/>
										</div>
										<Stack direction='column' alignItems='flex-start'>
											<span style={{ color: '#6CD6FF' }}>{customer.label}</span>
											<span style={{ color: '#D4D4D4', fontSize: 13 }}>
												{customer.email}
											</span>
											<span style={{ color: '#D4D4D4', fontSize: 13 }}>
												{customer.phone1}
											</span>
										</Stack>
									</Stack>
								</Panel>

								<Panel
									header={
										<Stack justifyContent='space-between'>
											<span>Billing Address</span>
											{/* <Button
												appearance='link'
												size='sm'
												style={{ padding: 0 }}
												onClick={() =>
													dispatch(
														setDrawerOpen({
															mode: 'edit',
															data: {
																...customer?.billing,
																type: 'billing',
															},
														})
													)
												}
											>
												Edit
											</Button> */}
										</Stack>
									}
								>
									<Stack
										direction='column'
										alignItems='flex-start'
										style={{ color: '#D4D4D4', fontSize: 13 }}
									>
										<div>
											{customer?.billing.firstName} {customer?.billing.lastName}
										</div>
										<div>{customer?.billing.address}</div>
										<div>
											{customer?.billing.town}, {customer?.billing.region}
										</div>
										<div>{customer?.billing.digitalAddress}</div>
									</Stack>
								</Panel>

								<Panel
									header={
										<Stack justifyContent='space-between'>
											<span>Shipping Address</span>
											{/* <Button
												appearance='link'
												size='sm'
												style={{ padding: 0 }}
												onClick={() =>
													dispatch(
														setDrawerOpen({
															mode: 'edit',
															data: {
																...activeShipping,
																type: 'shipping',
															},
														})
													)
												}
											>
												Edit
											</Button> */}
										</Stack>
									}
								>
									<Stack
										direction='column'
										alignItems='flex-start'
										style={{ color: '#D4D4D4', fontSize: 13 }}
									>
										<div>
											{activeShipping?.firstName} {activeShipping?.lastName}
										</div>
										<div>{activeShipping?.address}</div>
										<div>
											{activeShipping?.town}, {activeShipping?.region}
										</div>
										<div>{activeShipping?.digitalAddress}</div>
									</Stack>
								</Panel>
							</PanelGroup>
						)}
					</Col>
				</Row>
			</Grid>
		</>
	)
}
export default NewOrderForm
