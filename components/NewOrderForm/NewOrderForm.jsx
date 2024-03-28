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
	Panel,
	PanelGroup,
	Placeholder,
	Row,
	Stack,
} from 'rsuite'

import TrashIcon from '@rsuite/icons/Trash'
import { getCurrentRate } from '@/redux/features/orders/ordersSlice'
import { useEffect, useState } from 'react'

const NewOrderForm = ({ handleModalOpen }) => {
	const dispatch = useDispatch()
	const items = useSelector(selectAllCartItems)
	const rate = useSelector(getCurrentRate)
	const cartPriceTotal = useSelector(totalPriceSelector)
	const cartItemsTotal = useSelector(totalCartItemSelector)

	const [discount, setDiscount] = useState(0)
	const [shipping, setShipping] = useState(0)
	const [subtotal, setSubtotal] = useState(0)
	const [total, setTotal] = useState(0)

	const handleCalculations = () => {
		const discountValue = (Number(discount) / 100) * cartPriceTotal
		const discountDifference = cartPriceTotal - discountValue
		const grandTotal = discountDifference + Number(shipping)
		console.log(grandTotal * rate)
		setSubtotal(discountDifference)
		setTotal(grandTotal)
	}

	// const calculateSubtotal = () => {
	// 	const discountValue = (Number(discount) / 100) * cartPriceTotal
	// 	const difference = cartPriceTotal - discountValue
	// 	setSubtotal(difference)
	// }

	// const calculateTotal = () => {
	// 	const sum = subtotal + Number(shipping)
	// 	setTotal(sum)
	// }

	useEffect(() => {
		// calculateSubtotal()
		// calculateTotal()
		handleCalculations()
	}, [cartItemsTotal])

	return (
		<Grid fluid>
			<Row gutter={16}>
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
							<Row style={{ marginBottom: 30 }}>
								{items.length > 0 ? (
									items.map(item => (
										<Col
											key={item.product._id}
											xs={24}
											style={{ marginBottom: 20 }}
										>
											<Stack
												justifyContent='space-between'
												alignItems='center'
												style={{ fontSize: 12, color: '#D4D4D4' }}
											>
												<Stack spacing={15}>
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
													<Stack
														direction='column'
														alignItems='flex-start'
														style={{ width: 400 }}
													>
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
							</Row>

							<Row style={{ marginBottom: 50 }}>
								<Col xs={12}>
									<label style={{ display: 'flex', marginBottom: 5 }}>
										Notes:
									</label>
									<Input as='textarea' placeholder='Add a note...' />
								</Col>

								<Col xs={12} style={{ fontSize: 12, color: '#D4D4D4' }}>
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
											<span>{roundMoney(subtotal * rate)}</span>
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
											<span>{roundMoney(total * rate)}</span>
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
					<PanelGroup bordered>
						<Panel header='Customer'>
							<Placeholder.Paragraph />
						</Panel>
						<Panel header='Shipping Address'>
							<Placeholder.Paragraph />
						</Panel>
						<Panel header='Billing Address'>
							<Placeholder.Paragraph />
						</Panel>
					</PanelGroup>
				</Col>
			</Row>
		</Grid>
	)
}
export default NewOrderForm
