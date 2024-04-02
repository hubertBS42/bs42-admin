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
	AutoComplete,
	Button,
	Col,
	Grid,
	InlineEdit,
	Input,
	InputGroup,
	InputNumber,
	InputPicker,
	Panel,
	PanelGroup,
	Placeholder,
	Row,
	SelectPicker,
	Stack,
} from 'rsuite'

import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import SearchIcon from '@rsuite/icons/Search'
import TrashIcon from '@rsuite/icons/Trash'
import { getCurrentRate } from '@/redux/features/orders/ordersSlice'
import { useEffect, useState } from 'react'
import { useUsers } from '@/hooks/useUsers'

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
	const [selectedCustomer, setSelectedCustomer] = useState(null)

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
					{!selectedCustomer ? (
						<Panel
							bordered
							header={
								<Stack justifyContent='space-between'>
									<span>Find or create a customer</span>
									<Button appearance='link' size='sm' style={{ padding: 0 }}>
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
								onSelect={value => setSelectedCustomer(JSON.parse(value))}
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
							{/* <InputGroup inside style={{ width: '100%' }}>
							<InputGroup.Addon>
								<SearchIcon />
							</InputGroup.Addon>
							<AutoComplete
								placeholder='Search users'
								onChange={searchUsers}
								data={users.map(user => user.label)}
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
						</InputGroup> */}
							{/* <InputGroup inside>
							<InputGroup.Addon>
								<SearchIcon />
							</InputGroup.Addon>
							<Input
								placeholder='Search users'
								onChange={searchUsers}
								style={{ width: '100%' }}
							/>
							<InputGroup.Addon>
								{loading && <SpinnerIcon spin />}
							</InputGroup.Addon>
						</InputGroup> */}

							{/* {users.length > 0 &&
							users.map(user => (
								<Stack
									key={user._id}
									direction='column'
									alignItems='flex-start'
								>
									<span>{user.label}</span>
									<span>{user.role.title}</span>
								</Stack>
							))} */}
						</Panel>
					) : (
						<PanelGroup bordered>
							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Customer</span>
										<Button
											appearance='link'
											size='sm'
											style={{ padding: 0 }}
											onClick={() => setSelectedCustomer(null)}
										>
											Cancel
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
											objectFit: 'contain',
											borderRadius: '50%',
											overflow: 'hidden',
										}}
									>
										<Image
											src={
												selectedCustomer?.profileImg?.url || '/images/profile.png'
											}
											alt={selectedCustomer.label}
											fill
											sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
										/>
									</div>
									<Stack direction='column' alignItems='flex-start'>
										<span style={{ color: '#6CD6FF' }}>
											{selectedCustomer.label}
										</span>
										<span style={{ fontSize: 11 }}>
											{selectedCustomer.email}
										</span>
										<span style={{ fontSize: 11 }}>
											{selectedCustomer.phone1}
										</span>
									</Stack>
								</Stack>
							</Panel>
							<Panel header='Shipping Address'>
								<Row>
									<Col xs={12}>
										<InlineEdit placeholder='First name' value='Hubert' />
									</Col>
									<Col xs={12}>
										<InlineEdit placeholder='Last name' value='Quarshie' />
									</Col>
								</Row>
							</Panel>
							<Panel header='Billing Address'>
								<Placeholder.Paragraph />
							</Panel>
						</PanelGroup>
					)}
				</Col>
			</Row>
		</Grid>
	)
}
export default NewOrderForm
