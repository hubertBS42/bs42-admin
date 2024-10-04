'use client'

import {
	calculateCartTotal,
	fetcher,
	genFullName,
	roundMoney,
} from '@/utils/functions'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import {
	Button,
	ButtonToolbar,
	Col,
	Grid,
	Input,
	Modal,
	Panel,
	PanelGroup,
	Radio,
	RadioGroup,
	Row,
	Stack,
	Text,
} from 'rsuite'

import { useEffect, useState } from 'react'
import { setDrawerOpen } from '@/redux/features/drawer/drawerSlice'
import ManageOrderCustomerDrawer from '../ManageOrderCustomerDrawer/ManageOrderCustomerDrawer'
import AddDiscountPopover from '../AddDiscountPopover/AddDiscountPopover'
import AddShippingPopover from '../AddShippingPopper/AddShippingPopover'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'
import axios from 'axios'
import SendQuotationModal from '../SendQuotationModal/SendQuotationModal'
import { emptyCart } from '@/redux/features/cart/cartSlice'

const QuotationForm = ({ quotation }) => {
	const router = useRouter()
	const dispatch = useDispatch()

	const [isLoading, setIsLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [isDownloading, setIsDownloading] = useState(false)
	const [total, setTotal] = useState(0)
	const [subtotal, setSubtotal] = useState(0)
	const [enableSubmit, setEnableSubmit] = useState(false)
	const [quotationDetails, setQuotationDetails] = useState({
		user: quotation.user,
		createdBy: quotation.createdBy,
		quotationNumber: quotation.quotationNumber,
		contact: {
			firstName: quotation.contact.firstName,
			lastName: quotation.contact.lastName,
			email: quotation.contact.email,
			phone: quotation.contact.phone,
		},
		billing: {
			firstName: quotation.billing.firstName,
			lastName: quotation.billing.lastName,
			email: quotation.billing.email,
			region: quotation.billing.region,
			town: quotation.billing.town,
			address: quotation.billing.address,
		},
		shipping: {
			firstName: quotation?.shipping?.firstName || '',
			lastName: quotation?.shipping?.lastName || '',
			phone: quotation?.shipping?.phone || '',
			region: quotation?.shipping?.region || '',
			town: quotation?.shipping?.town || '',
			address: quotation?.shipping?.address || '',
			method: quotation.shipping.method,
			status: quotation.shipping.status,
			cost: quotation.shipping.cost,
		},
		order: quotation?.order || null,
		rate: quotation.rate,
		discount: {
			type: quotation.discount.type,
			value: quotation.discount.value,
			equivalent: quotation.discount.equivalent,
			reason: quotation?.discount?.reason || '',
		},
		products: quotation.products,
		payment: {
			method: quotation.payment.method,
			status: quotation.payment.status,
		},
		subtotal: quotation.subtotal,
		total: quotation.total,
		notes: quotation?.notes || '',
	})

	const updateCustomerDetails = formValue => {
		setQuotationDetails(prev => ({
			...prev,
			billing: { ...quotationDetails.billing, ...formValue.billing },
			shipping: { ...quotationDetails.shipping, ...formValue.shipping },
		}))
	}

	const handleSubmit = async () => {
		setIsLoading(true)

		const { status: updateStatus, message } = await fetcher(
			`/api/quotations/${quotation.quotationNumber}`,
			{
				method: 'PATCH',
				body: JSON.stringify(quotationDetails),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			}
		)

		if (updateStatus === 'success') {
			router.push('/quotations')
			toast.success('Quotation updated.')
		} else {
			toast.error('Failed to update quotation.')
		}

		setIsLoading(false)
	}

	const handleQuotationDownload = async () => {
		setIsDownloading(true)

		try {
			const response = await axios({
				url: '/api/quotations/export/download', //your url
				method: 'POST',
				data: quotation,
				responseType: 'blob', // important
			})

			// create file link in browser's memory
			const href = URL.createObjectURL(response.data)

			// create "a" HTML element with href to file & click
			const link = document.createElement('a')
			link.href = href
			link.setAttribute(
				'download',
				`quotation_${quotationDetails.quotationNumber}.pdf`
			) //or any other extension
			document.body.appendChild(link)
			link.click()

			// clean up "a" element & remove ObjectURL
			document.body.removeChild(link)
			URL.revokeObjectURL(href)
			setIsDownloading(false)
			toast.success('Quotation downloaded successfully.')
		} catch (error) {
			console.log(error)
			toast.error('Failed to download quotation.')
		}
	}

	const handleCreateOrder = async () => {
		setIsLoading(true)
		const preparedData = {
			...quotation,
			quotation: quotation._id,
			invoice: {
				email: false,
				date: new Date(),
				dueDate: new Date(),
			},
			status: [
				{
					type: 'created',
					timestamp: new Date().toISOString(),
				},
			],
		}

		delete preparedData.createdAt
		delete preparedData.updatedAt
		delete preparedData._id
		delete preparedData.notes
		delete preparedData.__v

		const {
			status: addStatus,
			message,
			data: order,
		} = await fetcher('/api/orders/add', {
			method: 'POST',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		if (addStatus === 'success') {
			const { status: updateStatus, message } = await fetcher(
				`/api/quotations/${quotation.quotationNumber}`,
				{
					method: 'PATCH',
					body: JSON.stringify({ ...quotationDetails, order: order._id }),
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
				}
			)

			router.push(`/orders/${order.orderNumber}`)
			toast.success('Order created.')
			dispatch(emptyCart())
		} else {
			toast.error('Failed to create order.')
		}

		setOpen(false)
	}

	useEffect(() => {
		const handleCalculations = () => {
			const cartTotal = calculateCartTotal(quotationDetails.products)

			const discountDifference =
				cartTotal -
				quotationDetails.discount.equivalent / quotationDetails.rate

			setQuotationDetails(prev => ({
				...prev,
				subtotal: discountDifference,
				total: discountDifference + quotationDetails.shipping.cost,
			}))
			setSubtotal(discountDifference * quotationDetails.rate)
			setTotal(
				discountDifference * quotationDetails.rate +
					Number(quotationDetails.shipping.cost) * quotationDetails.rate
			)
		}

		const handleEnableSubmit = () => {
			let shippingCost
			let shippingAddress

			if (quotationDetails.shipping.method === 'delivery') {
				if (quotationDetails.shipping.cost > 0) {
					shippingCost = true
				} else {
					shippingCost = false
				}

				if (quotationDetails?.shipping.address) {
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
						quotationDetails.shipping.method === 'delivery' ? true : false,
					provided: shippingCost,
				},
				{
					field: 'shippingAddress',
					required:
						quotationDetails.shipping.method === 'delivery' ? true : false,
					provided: shippingAddress,
				},
			]

			const missing = element => element.required && !element.provided

			const result = providedFields.some(missing)

			setEnableSubmit(result)
		}

		handleCalculations()
		handleEnableSubmit()
	}, [
		quotationDetails.discount.value,
		quotationDetails.discount.type,
		quotationDetails.shipping.method,
		quotationDetails.shipping.cost,
		quotationDetails.shipping.address,
		quotationDetails.products,
		quotationDetails.rate,
	])

	return (
		<>
			<ManageOrderCustomerDrawer
				setCustomer={updateCustomerDetails}
				shipmentMethod={quotationDetails.shipping.method}
			/>

			<Modal open={open} onClose={() => setOpen(false)} size='xs'>
				<Modal.Header>
					<Modal.Title>Create order</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Text>
						You are about to turn this quote into an order. Are you sure you
						want to proceed?
					</Text>
				</Modal.Body>
				<Modal.Footer>
					<Button
						appearance='primary'
						onClick={handleCreateOrder}
						loading={isLoading}
					>
						Proceed
					</Button>
					<Button
						onClick={() => setOpen(false)}
						appearance='subtle'
						disabled={isLoading}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
			<Grid fluid>
				<Row>
					<Col xs={16}>
						<PanelGroup bordered>
							<Panel header='Quotation details'>
								{quotationDetails.products.map(product => (
									<Row key={product._id}>
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
													GHS {roundMoney(product.price * quotationDetails.rate)}
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
														product.price * product.quantity * quotationDetails.rate
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
											value={quotationDetails.notes}
											onChange={notes =>
												setQuotationDetails(prev => ({ ...prev, notes }))
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
												{quotation.order ? (
													<Text>Discount</Text>
												) : (
													<AddDiscountPopover
														orderDetails={quotationDetails}
														setOrderDetails={setQuotationDetails}
														cartItemsTotal={quotationDetails.products.length}
														isLoading={isLoading}
														rate={quotationDetails.rate}
													/>
												)}
											</Col>
											<Col xs={15}>
												<Text>
													{quotationDetails.discount.type === 'percentage'
														? '%'
														: 'GHS'}{' '}
													{quotationDetails.discount.type === 'percentage'
														? quotationDetails.discount.value
														: roundMoney(quotationDetails.discount.equivalent)}
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

										{quotationDetails.shipping.method === 'delivery' && (
											<Row style={{ textAlign: 'right', marginBottom: 12 }}>
												<Col xs={9}>
													{quotation.order ? (
														<Text>Shipping</Text>
													) : (
														<AddShippingPopover
															orderDetails={quotationDetails}
															setOrderDetails={setQuotationDetails}
															rate={quotationDetails.rate}
															isLoading={isLoading}
														/>
													)}
												</Col>
												<Col xs={15}>
													<Text>
														GHS{' '}
														{roundMoney(
															quotationDetails.shipping.cost * quotationDetails.rate
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
							<Panel header='Payment method'>
								<RadioGroup
									value={quotationDetails.payment.method}
									onChange={method =>
										setQuotationDetails(prev => ({
											...prev,
											payment: { ...quotationDetails.payment, method },
										}))
									}
									disabled={isLoading || quotation.order}
								>
									<Radio value='cash'>Cash</Radio>
									<Radio value='mobile money' disabled>
										Mobile money
									</Radio>
								</RadioGroup>
							</Panel>

							<Panel header='Shipment method'>
								<RadioGroup
									value={quotationDetails.shipping.method}
									onChange={method => {
										setQuotationDetails(prev => ({
											...prev,
											shipping: {
												...quotation.shipping,
												method,
												cost: method === 'pickup' && 0,
											},
										}))
									}}
									disabled={isLoading || quotation.order}
								>
									<Radio value='pickup'>Pickup</Radio>
									<Radio value='delivery'>Delivery</Radio>
								</RadioGroup>
							</Panel>
							<Panel>
								<Row>
									<Col xs={8}>
										<SendQuotationModal
											enableSubmit={enableSubmit}
											isLoading={isLoading}
											quotation={quotation}
										/>
									</Col>
									<Col xs={8}>
										<Button
											block
											appearance='ghost'
											disabled={isLoading || enableSubmit}
											onClick={handleQuotationDownload}
											loading={isDownloading}
										>
											Download quotation
										</Button>
									</Col>
									{!quotation?.order && (
										<Col xs={8}>
											<Button
												block
												appearance='primary'
												disabled={isLoading}
												loading={isLoading}
												onClick={() => setOpen(true)}
											>
												Create order
											</Button>
										</Col>
									)}
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
										{!quotation.order && (
											<Stack spacing={10}>
												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0 }}
													onClick={() => {
														dispatch(
															setDrawerOpen({
																mode: 'edit',
																data: quotationDetails,
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
												quotation.contact?.profileImg?.url ||
												'/images/profile.png'
											}
											alt={genFullName(
												quotation.contact.firstName,
												quotation.contact.lastName
											)}
											fill
											sizes='(max-width: 768px) 80px, (max-width: 1200px) 80px, 80px'
										/>
									</div>
									<Stack direction='column' alignItems='flex-start'>
										<span style={{ color: '#6CD6FF' }}>
											{genFullName(
												quotation.contact.firstName,
												quotation.contact.lastName
											)}
										</span>
										<span style={{ color: '#D4D4D4', fontSize: 13 }}>
											{quotation.contact.email}
										</span>
										<span style={{ color: '#D4D4D4', fontSize: 13 }}>
											{quotation.contact.phone}
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
										{quotationDetails.billing.firstName}{' '}
										{quotationDetails.billing.lastName}
									</div>
									<div>{quotationDetails.billing.email}</div>
									<div>{quotationDetails.billing.address}</div>
									<div>
										{quotationDetails.billing.town},{' '}
										{quotationDetails.billing.region}
									</div>
								</Stack>
							</Panel>

							{quotationDetails.shipping.method === 'delivery' && (
								<Panel header='Shipping address'>
									{quotationDetails.shipping.address ? (
										<Stack
											direction='column'
											alignItems='flex-start'
											style={{ color: '#D4D4D4', fontSize: 13 }}
										>
											<div>
												{quotationDetails.shipping.firstName}{' '}
												{quotationDetails.shipping.lastName}
											</div>
											<div>{quotationDetails.shipping.phone}</div>
											<div>{quotationDetails.shipping.address}</div>
											<div>
												{quotationDetails.shipping.town},{' '}
												{quotationDetails.shipping?.region}
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
									Update quotation
								</Button>
								<Button as={Link} href='/quotations' disabled={isLoading}>
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
export default QuotationForm
