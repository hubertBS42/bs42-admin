'use client'
import {
	Button,
	Col,
	FlexboxGrid,
	Grid,
	Input,
	InputGroup,
	InputNumber,
	Panel,
	PanelGroup,
	Placeholder,
	Row,
	Stack,
} from 'rsuite'

import SearchIcon from '@rsuite/icons/Search'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import TrashIcon from '@rsuite/icons/Trash'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AddItemsModal from '@/components/AddItemsModal/AddItemsModal'
import { loadAllCategories } from '@/redux/features/categories/categoriesActions'
import { loadCurrentRate } from '@/redux/features/orders/ordersActions'
import { useDispatch, useSelector } from 'react-redux'
import {
	modifyItem,
	selectAllCartItems,
} from '@/redux/features/cart/cartSlice'
import { roundMoney } from '@/utils/functions'
import { getCurrentRate } from '@/redux/features/orders/ordersSlice'

const CreateOrderPage = () => {
	const dispatch = useDispatch()
	const [modalOpen, setModalOpen] = useState(false)
	const handleModalClose = () => setModalOpen(false)
	const handleModalOpen = () => setModalOpen(true)
	const items = useSelector(selectAllCartItems)
	const rate = useSelector(getCurrentRate)

	useEffect(() => {
		loadAllCategories()
		loadCurrentRate()
	}, [])
	return (
		<>
			<AddItemsModal
				open={modalOpen}
				handleClose={handleModalClose}
				rate={rate}
			/>
			,
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
										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
												>
													Add discount
												</Button>
											</Col>
											<Col xs={15}>
												<span>--</span>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<span>Subtotal</span>
											</Col>
											<Col xs={15}>
												<span>GHS 0.00</span>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
												>
													Add shipping
												</Button>
											</Col>
											<Col xs={15}>
												<span>--</span>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
												>
													Taxes
												</Button>
											</Col>
											<Col xs={15}>
												<span>GHS 0.00</span>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right' }}>
											<Col xs={9}>
												<span>Total</span>
											</Col>
											<Col xs={15}>
												<span>GHS 0.00</span>
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
		</>
	)
}
export default CreateOrderPage
