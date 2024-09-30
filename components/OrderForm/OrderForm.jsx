'use client'
import AddDiscountPopover from '@/components/AddDiscountPopover/AddDiscountPopover'
import {
	calculateCartTotal,
	fetcher,
	genFullName,
	roundMoney,
} from '@/utils/functions'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
	Button,
	ButtonToolbar,
	Col,
	DatePicker,
	Grid,
	Input,
	InputNumber,
	Panel,
	PanelGroup,
	Radio,
	RadioGroup,
	Row,
	SelectPicker,
	Stack,
	Steps,
	Text,
	Toggle,
} from 'rsuite'
import OrderStatusPanel from '../OrderStatusPanel/OrderStatusPanel'
import AddShippingPopover from '../AddShippingPopper/AddShippingPopover'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import { useDispatch } from 'react-redux'
import ManageOrderCustomerDrawer from '../ManageOrderCustomerDrawer/ManageOrderCustomerDrawer'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import SendInvoiceModal from '../SendInvoiceModal/SendInvoiceModal'
import { orderStatusOptions } from '@/utils/data'

const OrderForm = ({ order }) => {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const dispatch = useDispatch()
	const [status, setStatus] = useState(
		order.status.map(event => event.type)
	)
	const [editable, setEditable] = useState(true)
	const [isDownloading, setIsDownloading] = useState(false)

	const [enableSubmit, setEnableSubmit] = useState(false)
	const [steps, setSteps] = useState([])
	const [total, setTotal] = useState(0)
	const [subtotal, setSubtotal] = useState(0)
	const [orderDetails, setOrderDetails] = useState({
		user: order.user,
		orderNumber: order.orderNumber,
		contact: {
			firstName: order.contact.firstName,
			lastName: order.contact.lastName,
			email: order.contact.email,
			phone: order.contact.phone,
		},
		billing: {
			firstName: order.billing.firstName,
			lastName: order.billing.lastName,
			email: order.billing.email,
			region: order.billing.region,
			town: order.billing.town,
			address: order.billing.address,
		},
		shipping: {
			firstName: order?.shipping?.firstName || '',
			lastName: order?.shipping?.lastName || '',
			phone: order?.shipping?.phone || '',
			region: order?.shipping?.region || '',
			town: order?.shipping?.town || '',
			address: order?.shipping?.address || '',
			method: order.shipping.method,
			status: order.shipping.status,
			cost: order.shipping.cost,
		},
		status: order.status,
		rate: order.rate,
		discount: {
			type: order.discount.type,
			value: order.discount.value,
			equivalent: order.discount.equivalent,
			reason: order?.discount?.reason || '',
		},
		products: order.products,
		payment: {
			method: order.payment.method,
			status: order.payment.status,
		},
		subtotal: order.subtotal,
		total: order.total,
		notes: order?.notes || '',
		invoice: {
			number: order.invoice.number,
			date: order.invoice.date,
			dueDate: order.invoice.dueDate,
			email: false,
		},
	})

	const updateCustomerDetails = formValue => {
		setOrderDetails(prev => ({
			...prev,
			billing: { ...orderDetails.billing, ...formValue.billing },
			shipping: { ...orderDetails.shipping, ...formValue.shipping },
		}))
	}

	const handleSubmit = async () => {
		setIsLoading(true)

		let latestStatus =
			order.shipping.method === orderDetails.shipping.method
				? [...order.status]
				: [{ type: 'created', timestamp: new Date().toISOString() }]

		if (status.includes('cancelled')) {
			latestStatus.push({
				type: 'cancelled',
				timestamp: new Date().toISOString(),
			})
		} else {
			const latestStepIndex = steps.findIndex(
				step => step.value === status[status.length - 1]
			)

			const statusUpdate = steps.slice(
				latestStatus.length,
				latestStepIndex + 1
			)

			statusUpdate.forEach(event =>
				latestStatus.push({
					type: event.value,
					timestamp: new Date().toISOString(),
				})
			)
		}

		const preparedData = {
			...orderDetails,
			status: latestStatus,
		}

		const { status: updateStatus, message } = await fetcher(
			`/api/orders/${order.orderNumber}`,
			{
				method: 'PATCH',
				body: JSON.stringify(preparedData),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			}
		)

		if (updateStatus === 'success') {
			router.push('/orders')
			toast.success('Order updated.')
		} else {
			toast.error('Failed to update order.')
		}

		setIsLoading(false)
	}

	const handleInvoiceDownload = async () => {
		setIsDownloading(true)
		try {
			const response = await axios({
				url: '/api/invoices/download', //your url
				method: 'POST',
				data: orderDetails,
				responseType: 'blob', // important
			})

			// create file link in browser's memory
			const href = URL.createObjectURL(response.data)

			// create "a" HTML element with href to file & click
			const link = document.createElement('a')
			link.href = href
			link.setAttribute(
				'download',
				`invoice_${orderDetails.invoice.number}.pdf`
			) //or any other extension
			document.body.appendChild(link)
			link.click()

			// clean up "a" element & remove ObjectURL
			document.body.removeChild(link)
			URL.revokeObjectURL(href)
			setIsDownloading(false)
			toast.success('Invoice downloaded successfully.')
		} catch (error) {
			toast.error('Failed to download invoice.')
		}
	}

	useEffect(() => {
		const handleCalculations = () => {
			const cartTotal = calculateCartTotal(orderDetails.products)

			const discountDifference =
				cartTotal - orderDetails.discount.equivalent / orderDetails.rate

			setOrderDetails(prev => ({
				...prev,
				subtotal: discountDifference,
				total: discountDifference + orderDetails.shipping.cost,
			}))

			setSubtotal(discountDifference * orderDetails.rate)
			setTotal(
				discountDifference * orderDetails.rate +
					Number(orderDetails.shipping.cost) * orderDetails.rate
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

				if (orderDetails?.shipping.address) {
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
			]

			const missing = element => element.required && !element.provided

			const result = providedFields.some(missing)

			setEnableSubmit(result)
		}

		const checkIfEditable = () => {
			const options = ['cancelled', 'pickedUp', 'delivered']
			const events = order.status.map(event => event.type)
			const atLeastOne = options.some(option => events.includes(option))

			if (atLeastOne) setEditable(false)
		}

		const setOrderSteps = () => {
			const { delivery, pickup } = orderStatusOptions
			if (orderDetails.shipping.method === 'delivery') setSteps(delivery)
			if (orderDetails.shipping.method === 'pickup') setSteps(pickup)
		}

		checkIfEditable()
		handleCalculations()
		handleEnableSubmit()
		setOrderSteps()
	}, [
		orderDetails.discount.value,
		orderDetails.discount.type,
		orderDetails.shipping.method,
		orderDetails.shipping.cost,
		orderDetails.shipping.address,
		orderDetails.products,
		orderDetails.rate,
	])

	return (
		<>
			<ManageOrderCustomerDrawer
				updateCustomerDetails={updateCustomerDetails}
				shipmentMethod={orderDetails.shipping.method}
			/>
			<Grid fluid>
				<Row style={{ marginBottom: 10 }}>
					<Col xs={24}>
						<OrderStatusPanel
							orderDetails={orderDetails}
							status={status}
							setStatus={setStatus}
							editable={editable}
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={16}>
						<PanelGroup bordered>
							<Panel header='Order details'>
								{orderDetails.products.map(product => (
									<Row key={product._id}>
										<Col xs={24} style={{ marginBottom: 20 }}>
											<Stack
												justifyContent='space-between'
												alignItems='center'
												style={{
													fontSize: 12,
													color: '#D4D4D4',
												}}
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
															src={
																product?.images
																	? product.images[0]?.url
																	: '/images/labour.jpg'
															}
															alt={product.title}
															fill
															sizes='(max-width: 768px) 60px, (max-width: 1200px) 60px, 60px'
														/>
													</div>
													<Stack direction='column' alignItems='flex-start'>
														<span style={{ color: '#6CD6FF' }}>
															{product.title}
														</span>
														<span>{product.brand.name}</span>
													</Stack>
												</Stack>

												<span style={{ display: 'flex', width: 100 }}>
													GHS {roundMoney(product.price * orderDetails.rate)}
												</span>

												<span>x</span>

												<span>{product.quantity}</span>

												<span
													style={{
														display: 'flex',
														justifyContent: 'flex-end',
														width: 100,
													}}
												>
													GHS{' '}
													{roundMoney(
														product.price * product.quantity * orderDetails.rate
													)}
												</span>
											</Stack>
										</Col>
									</Row>
								))}

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
												{!editable ? (
													<Text>Discount</Text>
												) : (
													<AddDiscountPopover
														orderDetails={orderDetails}
														setOrderDetails={setOrderDetails}
														cartItemsTotal={orderDetails.products.length}
														isLoading={isLoading}
														rate={orderDetails.rate}
													/>
												)}
											</Col>
											<Col xs={15}>
												<Text>
													{orderDetails.discount.type === 'percentage'
														? '%'
														: 'GHS'}{' '}
													{orderDetails.discount.type === 'percentage'
														? orderDetails.discount.value
														: roundMoney(orderDetails.discount.equivalent)}
												</Text>
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

										{orderDetails.shipping.method === 'delivery' && (
											<Row style={{ textAlign: 'right', marginBottom: 12 }}>
												<Col xs={9}>
													{!editable ? (
														<Text>Shipping</Text>
													) : (
														<AddShippingPopover
															orderDetails={orderDetails}
															setOrderDetails={setOrderDetails}
															rate={orderDetails.rate}
															isLoading={isLoading}
														/>
													)}
												</Col>
												<Col xs={15}>
													<Text>
														GHS{' '}
														{roundMoney(
															orderDetails.shipping.cost * orderDetails.rate
														)}
													</Text>
												</Col>
											</Row>
										)}

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
									disabled={isLoading || !editable}
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
										onSelect={status =>
											setOrderDetails(prev => ({
												...prev,
												shipping: { ...orderDetails.shipping, status },
											}))
										}
										disabled={isLoading}
									/> */}
									</Stack>
								}
							>
								<RadioGroup
									value={orderDetails.shipping.method}
									onChange={method => {
										if (method === order.shipping.method) {
											setStatus(order.status.map(event => event.type))
										} else {
											setStatus(['created'])
										}

										setOrderDetails(prev => ({
											...prev,
											shipping: {
												...orderDetails.shipping,
												method,
												cost: method === 'pickup' && 0,
											},
										}))
									}}
									disabled={isLoading || !editable}
								>
									<Radio value='pickup'>Pickup</Radio>
									<Radio value='delivery'>Delivery</Radio>
								</RadioGroup>
							</Panel>
							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Invoice</span>
										<ButtonToolbar>
											<SendInvoiceModal
												enableSubmit={enableSubmit}
												isLoading={isLoading}
												order={orderDetails}
											/>
											<Button
												appearance='ghost'
												disabled={isLoading || enableSubmit}
												onClick={handleInvoiceDownload}
												loading={isDownloading}
											>
												Download Invoice
											</Button>
										</ButtonToolbar>
										{/* <label
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
										</label> */}
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
												defaultValue={new Date(orderDetails.invoice.date)}
												readOnly
											/>
										</Stack>
									</Col>
									<Col xs={12}>
										<Stack spacing={5} direction='column' alignItems='stretch'>
											<label style={{ fontSize: 13 }}>Due date:</label>
											<DatePicker
												placeholder='Select Date'
												style={{ width: '100%' }}
												defaultValue={new Date(orderDetails.invoice.dueDate)}
												readOnly
											/>
										</Stack>
									</Col>
								</Row>
							</Panel>
						</PanelGroup>
					</Col>
					<Col xs={8}>
						<PanelGroup bordered>
							<Panel
								header={
									<Stack justifyContent='space-between'>
										<span>Customer</span>
										{editable && (
											<Stack spacing={10}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
													onClick={() => {
														dispatch(
															setDrawerOpen({
																mode: 'edit',
																data: orderDetails,
															})
														)
													}}
													disabled={isLoading}
												>
													Edit
												</Button>
											</Stack>
										)}
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
												order.contact?.profileImg?.url || '/images/profile.png'
											}
											alt={genFullName(
												order.contact.firstName,
												order.contact.lastName
											)}
											fill
											sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
										/>
									</div>
									<Stack direction='column' alignItems='flex-start'>
										<span style={{ color: '#6CD6FF' }}>
											{genFullName(
												order.contact.firstName,
												order.contact.lastName
											)}
										</span>
										<span style={{ color: '#D4D4D4', fontSize: 13 }}>
											{order.contact.email}
										</span>
										<span style={{ color: '#D4D4D4', fontSize: 13 }}>
											{order.contact.phone}
										</span>
									</Stack>
								</Stack>
							</Panel>

							<Panel header='Billing address'>
								<Stack
									direction='column'
									alignItems='flex-start'
									style={{ color: '#D4D4D4', fontSize: 13 }}
								>
									<div>
										{orderDetails.billing.firstName}{' '}
										{orderDetails.billing.lastName}
									</div>
									<div>{orderDetails.billing.email}</div>
									<div>{orderDetails.billing.address}</div>
									<div>
										{orderDetails.billing.town}, {orderDetails.billing.region}
									</div>
								</Stack>
							</Panel>

							{orderDetails.shipping.method === 'delivery' && (
								<Panel header='Shipping address'>
									{orderDetails.shipping.address ? (
										<Stack
											direction='column'
											alignItems='flex-start'
											style={{ color: '#D4D4D4', fontSize: 13 }}
										>
											<div>
												{orderDetails.shipping.firstName}{' '}
												{orderDetails.shipping.lastName}
											</div>
											<div>{orderDetails.shipping.phone}</div>
											<div>{orderDetails.shipping.address}</div>
											<div>
												{orderDetails.shipping.town},{' '}
												{orderDetails.shipping?.region}
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

						<Stack justifyContent='flex-end' style={{ marginTop: '1em' }}>
							<ButtonToolbar>
								<Button
									appearance='primary'
									onClick={handleSubmit}
									disabled={enableSubmit}
									loading={isLoading}
								>
									Update order
								</Button>
								<Button as={Link} href='/orders' disabled={isLoading}>
									Cancel
								</Button>
							</ButtonToolbar>
						</Stack>
					</Col>
				</Row>
			</Grid>
		</>
	)
}
export default OrderForm
