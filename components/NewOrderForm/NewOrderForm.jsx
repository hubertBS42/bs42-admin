'use client'
import {
	emptyCart,
	modifyItem,
	removeItem,
	selectAllCartItems,
	totalCartItemSelector,
	totalPriceSelector,
} from '@/redux/features/cart/cartSlice'
import {
	fetcher,
	genFullName,
	generateInvoiceNumber,
	roundMoney,
} from '@/utils/functions'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import {
	Button,
	ButtonGroup,
	ButtonToolbar,
	Col,
	DatePicker,
	Grid,
	Input,
	InputNumber,
	InputPicker,
	Panel,
	PanelGroup,
	Popover,
	Radio,
	RadioGroup,
	Row,
	SelectPicker,
	Stack,
	Steps,
	Text,
	Toggle,
	Whisper,
} from 'rsuite'

import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import SearchIcon from '@rsuite/icons/Search'
import TrashIcon from '@rsuite/icons/Trash'
import { getCurrentRate } from '@/redux/features/orders/ordersSlice'
import { useEffect, useState } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import ManageOrderCustomerDrawer from '../ManageOrderCustomerDrawer/ManageOrderCustomerDrawer'
import AddDiscountPopover from '../AddDiscountPopover/AddDiscountPopover'
import AddShippingPopover from '../AddShippingPopper/AddShippingPopover'
import { selectAllCategories } from '@/redux/features/categories/categoriesSlice'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import CustomToggle from '../CustomToggle/CustomToggle'
import { isBefore, sub } from 'date-fns'
import OrderStatusPanel from '../OrderStatusPanel/OrderStatusPanel'

const NewOrderForm = ({ handleModalOpen }) => {
	const [users, loading, searchUsers] = useUsers()
	const router = useRouter()
	const dispatch = useDispatch()
	const items = useSelector(selectAllCartItems)
	const categories = useSelector(selectAllCategories)
	const rate = useSelector(getCurrentRate)
	const cartPriceTotal = useSelector(totalPriceSelector)
	const cartItemsTotal = useSelector(totalCartItemSelector)

	const [customer, setCustomer] = useState(null)
	const [steps, setSteps] = useState([])
	const [currentStatus, setCurrentStatus] = useState('created')
	const [isLoading, setIsLoading] = useState(false)
	const [total, setTotal] = useState(0)
	const [subtotal, setSubtotal] = useState(0)
	const [enableSubmit, setEnableSubmit] = useState(false)
	const [orderDetails, setOrderDetails] = useState({
		shipping: {
			method: 'pickup',
			status: 'pending',
			cost: 0,
		},
		payment: {
			method: 'cash',
			status: 'pending',
		},
		subtotal: 0,
		total: 0,
		discount: {
			percentage: 0,
			value: 0,
			reason: '',
		},
		notes: '',
		invoice: {
			email: false,
			date: new Date(),
			dueDate: new Date(),
		},
	})

	const fetchCategories = id => {
		const category = categories.find(category => category._id === id)
		return [
			category?.name,
			category?.parent?.name,
			category?.parent?.parent?.name,
		]
	}

	const handleSubmit = async () => {
		const { shipping, billingActive, profileImg, ...rest } =
			orderDetails

		setIsLoading(true)

		const index = steps.findIndex(step => step.value === currentStatus)
		const data = steps
			.map(step => ({
				type: step.value,
				timestamp: new Date().toISOString(),
			}))
			.slice(0, index + 1)

		const preparedData = {
			...customer,
			shipping: {
				firstName:
					orderDetails.shipping.method === 'pickup'
						? ''
						: customer.shipping.firstName,
				lastName:
					orderDetails.shipping.method === 'pickup'
						? ''
						: customer.shipping.lastName,
				region:
					orderDetails.shipping.method === 'pickup'
						? ''
						: customer.shipping.region,
				town:
					orderDetails.shipping.method === 'pickup'
						? ''
						: customer.shipping.town,
				address:
					orderDetails.shipping.method === 'pickup'
						? ''
						: customer.shipping.address,
				phone:
					orderDetails.shipping.method === 'pickup'
						? ''
						: customer.shipping.phone,
				town:
					orderDetails.shipping.method === 'pickup'
						? ''
						: customer.shipping.town,
				method: orderDetails.shipping.method,
				cost:
					orderDetails.shipping.method === 'delivery'
						? orderDetails.shipping.cost
						: 0,
				status: orderDetails.shipping.status,
			},
			products: items?.map(item => ({
				productRef: item.product._id || null,
				title: item.product.title,
				brand: {
					name: item.product.brand.name,
				},
				category: fetchCategories(item.product.category._id),
				images: item.product.images,
				quantity: item.quantity,
				price: item.product.sellPrice,
			})),
			rate,
			status: data,
			...rest,
		}

		const { status, message } = await fetcher('/api/orders/add', {
			method: 'POST',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		if (status === 'success') {
			toast.success('Order created.')
			dispatch(emptyCart())
			router.push('/orders')
		} else {
			toast.error('Failed to create order.')
		}

		setIsLoading(false)
	}

	useEffect(() => {
		const handleCalculations = () => {
			const discountValue =
				(Number(orderDetails.discount.percentage) / 100) * cartPriceTotal
			const discountDifference = cartPriceTotal - discountValue

			setOrderDetails(prev => ({
				...prev,
				subtotal: discountDifference,
				total: discountDifference + Number(orderDetails.shipping.cost),
			}))
			setSubtotal(discountDifference * rate)
			setTotal(
				discountDifference * rate +
					Number(orderDetails.shipping.cost) * rate
			)
		}

		const handleEnableSubmit = () => {
			let shippingCost
			let shippingAddress

			if (orderDetails.shipping.method === 'delivery') {
				if (orderDetails.shipping.cost > 0) {
					shippingCost = true
				} else {
					shippingCost = false
				}

				if (customer?.shipping) {
					shippingAddress = true
				} else {
					shippingAddress = false
				}
			} else {
				shippingCost = false
				shippingAddress = false
			}

			const providedFields = [
				{
					field: 'products',
					required: true,
					provided: cartItemsTotal === 0 ? false : true,
				},
				{
					field: 'customer',
					required: true,
					provided: !customer ? false : true,
				},
				{
					field: 'shippingCost',
					required:
						orderDetails.shipping.method === 'delivery' ? true : false,
					provided: shippingCost,
				},
				{
					field: 'shippingAddress',
					required:
						orderDetails.shipping.method === 'delivery' ? true : false,
					provided: shippingAddress,
				},
				{
					field: 'billingAddress',
					required: true,
					provided: customer?.billingActive ? true : false,
				},
			]

			const missing = element => element.required && !element.provided

			const result = providedFields.some(missing)

			setEnableSubmit(result)
		}

		handleCalculations()
		handleEnableSubmit()

		if (orderDetails.shipping.method === 'delivery') {
			setSteps([
				{ label: 'Pending', value: 'created' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Delivering', value: 'delivering' },
				{ label: 'Delivered', value: 'delivered' },
				{ label: 'Payment received', value: 'paymentReceived' },
			])
		} else {
			setSteps([
				{ label: 'Pending', value: 'created' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Ready for pickup', value: 'readyForPickup' },
				{ label: 'Payment received', value: 'paymentReceived' },
				{ label: 'Picked up', value: 'pickedUp' },
			])
		}
	}, [
		cartItemsTotal,
		orderDetails.discount.percentage,
		orderDetails.shipping.cost,
		orderDetails.shipping.method,
		customer,
		cartPriceTotal,
		rate,
	])

	return (
		<>
			<ManageOrderCustomerDrawer
				setCustomer={setCustomer}
				shipmentMethod={orderDetails.shipping.method}
			/>
			{/* <Stack justifyContent='space-between' style={{ marginBottom: 16 }}>
				<SelectPicker
					data={steps}
					searchable={false}
					cleanable={false}
					style={{ width: 224 }}
					value={currentStatus}
					disabledItemValues={['created']}
					onSelect={setCurrentStatus}
				/>
				<ButtonToolbar>
					<Button
						appearance='primary'
						onClick={handleSubmit}
						disabled={enableSubmit}
						loading={isLoading}
					>
						Create order
					</Button>
					<Button disabled={isLoading}>Cancel</Button>
				</ButtonToolbar>
			</Stack> */}
			<Grid fluid>
				<Row style={{ marginBottom: 10 }}>
					<Col xs={24}>
						<OrderStatusPanel
							orderDetails={orderDetails}
							status={currentStatus}
							setStatus={setCurrentStatus}
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
										<span>Order details</span>
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
														disabled={isLoading}
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
										<Text style={{ marginBottom: 5 }}>Notes:</Text>
										<Input
											as='textarea'
											placeholder='Add a note...'
											value={orderDetails.notes}
											onChange={notes =>
												setOrderDetails(prev => ({ ...prev, notes }))
											}
											disabled={isLoading}
										/>
									</Col>

									<Col xs={10} style={{ fontSize: 12, color: '#D4D4D4' }}>
										<Row
											style={{
												textAlign: 'right',
												marginBottom: 12,
											}}
										>
											<Col xs={9}>
												<AddDiscountPopover
													orderDetails={orderDetails}
													setOrderDetails={setOrderDetails}
													cartItemsTotal={cartItemsTotal}
													isLoading={isLoading}
													rate={rate}
													cartPriceTotal={cartPriceTotal}
												/>
											</Col>
											<Col xs={15}>
												<Text>% {orderDetails.discount.percentage}</Text>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<Text>Subtotal</Text>
											</Col>
											<Col xs={15}>
												<Text>GHS {roundMoney(subtotal)}</Text>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<AddShippingPopover
													orderDetails={orderDetails}
													setOrderDetails={setOrderDetails}
													rate={rate}
													isLoading={isLoading}
												/>
											</Col>
											<Col xs={15}>
												<Text>
													GHS {roundMoney(orderDetails.shipping.cost * rate)}
												</Text>
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
												<Text>Total</Text>
											</Col>
											<Col xs={15}>
												<Text>GHS {roundMoney(total)}</Text>
											</Col>
										</Row>
									</Col>
								</Row>
							</Panel>
							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Payment method</span>
										{/* <SelectPicker
											data={[
												{ label: 'Pending', value: 'pending' },
												{ label: 'Paid', value: 'paid' },
											]}
											label='Status'
											searchable={false}
											cleanable={false}
											style={{ width: 224 }}
											defaultValue={orderDetails.payment.status}
											onSelect={status =>
												setOrderDetails(prev => ({
													...prev,
													payment: { ...orderDetails.payment, status },
												}))
											}
											disabled={isLoading}
										/> */}
									</Stack>
								}
							>
								<RadioGroup
									value={orderDetails.payment.method}
									onChange={method =>
										setOrderDetails(prev => ({
											...prev,
											payment: { ...orderDetails.payment, method },
										}))
									}
									disabled={isLoading}
								>
									<Radio value='cash'>Cash</Radio>
									<Radio value='mobile money' disabled>
										Mobile money
									</Radio>
								</RadioGroup>
							</Panel>

							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Shipment method</span>
										{/* <SelectPicker
											data={[
												{ label: 'Pending', value: 'pending' },
												{ label: 'Completed', value: 'completed' },
											]}
											label='Status'
											searchable={false}
											cleanable={false}
											style={{ width: 224 }}
											defaultValue={orderDetails.shipping.status}
											onSelect={status => {
												setCurrentStatus('created')
												setOrderDetails(prev => ({
													...prev,
													shipping: { ...orderDetails.shipping, status },
												}))
											}}
											disabled={isLoading}
										/> */}
									</Stack>
								}
							>
								<RadioGroup
									value={orderDetails.shipping.method}
									onChange={method => {
										setOrderDetails(prev => ({
											...prev,
											shipping: {
												...orderDetails.shipping,
												method,
												cost: method === 'pickup' && 0,
											},
										}))
									}}
									disabled={isLoading}
								>
									<Radio value='pickup'>Pickup</Radio>
									<Radio value='delivery'>Delivery</Radio>
								</RadioGroup>
							</Panel>
							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Invoice</span>
										<label
											style={{
												fontSize: 14,
												display: 'flex',
												columnGap: 10,
												alignItems: 'center',
											}}
										>
											<Toggle
												onChange={value =>
													setOrderDetails(prev => ({
														...prev,
														invoice: {
															...orderDetails.invoice,
															email: value,
														},
													}))
												}
												checked={orderDetails.invoice.email}
											/>
											Send invoice
										</label>
									</Stack>
								}
							>
								<Row>
									<Col xs={12}>
										<Stack spacing={5} direction='column' alignItems='stretch'>
											<label style={{ fontSize: 13 }}>Date:</label>
											<DatePicker
												placeholder='Select Date'
												style={{ width: '100%' }}
												value={orderDetails.invoice.date}
												onChange={value =>
													setOrderDetails(prev => ({
														...prev,
														invoice: { ...orderDetails.invoice, date: value },
													}))
												}
												oneTap
												placement='topStart'
												shouldDisableDate={date =>
													isBefore(date, sub(new Date(), { days: 1 }))
												}
											/>
										</Stack>
									</Col>
									<Col xs={12}>
										<Stack spacing={5} direction='column' alignItems='stretch'>
											<label style={{ fontSize: 13 }}>Due date:</label>
											<DatePicker
												placeholder='Select Date'
												style={{ width: '100%' }}
												value={orderDetails.invoice.dueDate}
												onChange={value =>
													setOrderDetails(prev => ({
														...prev,
														invoice: { ...orderDetails.invoice, dueDate: value },
													}))
												}
												oneTap
												placement='topStart'
												shouldDisableDate={date =>
													isBefore(date, sub(new Date(), { days: 1 }))
												}
											/>
										</Stack>
									</Col>
								</Row>
							</Panel>
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
										return {
											label: genFullName(user.firstName, user.lastName),
											value: JSON.stringify(user),
										}
									})}
									onSelect={value => {
										const data = JSON.parse(value)
										const preparedData = {
											user: data._id,
											contact: {
												firstName: data.firstName,
												lastName: data.lastName,
												email: data.email,
												phone: data.phone1,
											},
											billingActive: data.billingActive,
											billing: {
												firstName: data?.billing?.firstName,
												lastName: data?.billing?.lastName,
												region: data?.billing?.region,
												town: data?.billing?.town,
												address: data?.billing?.address,
												email: data?.billing?.email,
											},
											shipping: data?.shipping.find(
												address => address.isPrimary
											),
											profileImg: data?.profileImg || null,
										}
										setCustomer(preparedData)
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
											<span>Customer</span>
											<Stack spacing={10}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
													onClick={() => {
														dispatch(
															setDrawerOpen({
																mode: 'edit',
																data: customer,
															})
														)
													}}
													disabled={isLoading}
												>
													Edit
												</Button>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
													onClick={() => setCustomer(null)}
													disabled={isLoading}
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
												alt={genFullName(
													customer.contact.firstName,
													customer.contact.lastName
												)}
												fill
												sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
											/>
										</div>
										<Stack direction='column' alignItems='flex-start'>
											<span style={{ color: '#6CD6FF' }}>
												{genFullName(
													customer.contact.firstName,
													customer.contact.lastName
												)}
											</span>
											<span style={{ color: '#D4D4D4', fontSize: 13 }}>
												{customer.contact.email}
											</span>
											<span style={{ color: '#D4D4D4', fontSize: 13 }}>
												{customer.contact.phone}
											</span>
										</Stack>
									</Stack>
								</Panel>

								<Panel header='Billing address'>
									{customer.billingActive ? (
										<Stack
											direction='column'
											alignItems='flex-start'
											style={{ color: '#D4D4D4', fontSize: 13 }}
										>
											<div>
												{customer?.billing?.firstName}{' '}
												{customer?.billing?.lastName}
											</div>
											<div>{customer?.billing?.email}</div>
											<div>{customer?.billing?.address}</div>
											<div>
												{customer?.billing?.town}, {customer?.billing?.region}
											</div>
										</Stack>
									) : (
										<p style={{ color: '#D4D4D4', fontSize: 13 }}>
											A billing address has not been set.
										</p>
									)}
								</Panel>

								{orderDetails.shipping.method === 'delivery' && (
									<Panel header='Shipping address'>
										{customer.shipping ? (
											<Stack
												direction='column'
												alignItems='flex-start'
												style={{ color: '#D4D4D4', fontSize: 13 }}
											>
												<div>
													{customer.shipping?.firstName}{' '}
													{customer.shipping?.lastName}
												</div>
												<div>{customer.shipping?.phone}</div>
												<div>{customer.shipping?.address}</div>
												<div>
													{customer.shipping?.town}, {customer.shipping?.region}
												</div>
											</Stack>
										) : (
											<p style={{ color: '#D4D4D4', fontSize: 13 }}>
												A shipping address has not been set.
											</p>
										)}
									</Panel>
								)}
							</PanelGroup>
						)}

						<Stack justifyContent='flex-end' style={{ marginTop: '1em' }}>
							<ButtonToolbar>
								<Button
									appearance='primary'
									onClick={handleSubmit}
									disabled={enableSubmit}
									loading={isLoading}
								>
									Create order
								</Button>
								<Button disabled={isLoading}>Discard</Button>
							</ButtonToolbar>
						</Stack>
					</Col>
				</Row>
			</Grid>
		</>
	)
}
export default NewOrderForm
