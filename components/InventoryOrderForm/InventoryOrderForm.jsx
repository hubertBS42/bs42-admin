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
import FileDownloadIcon from '@rsuite/icons/FileDownload'

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
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { updateFiles } from '@/utils/azure'
import SupplierCard from '../SupplierCard/SupplierCard'

const InventoryOrderForm = ({ order }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formValue, setFormValue] = useState({
		// supplier: order.supplier._id,
		// products: order.products,
		files: order.files,
		// shippingCost: order.shippingCost,
		// subtotal: order.subtotal,
		// total: order.total,
		status: order.status.map(event => event.type),
	})

	const dispatch = useDispatch()

	const handleFileDownload = async file => {
		// Fetch the file
		const response = await fetch(file.url)
		const blob = await response.blob()

		// Create a temporary URL for the blob
		const blobUrl = URL.createObjectURL(blob)

		// create "a" HTML element with href to file & click
		const link = document.createElement('a')
		link.href = blobUrl

		// Set the desired file name in the download attribute
		link.setAttribute('download', file.originalName) // 'file.name' is the desired file name

		// Append the link to the document, trigger the download, and clean up
		document.body.appendChild(link)
		link.click()

		// Clean up the temporary URL and the link element
		URL.revokeObjectURL(blobUrl) // Release the blob URL
		document.body.removeChild(link)
	}

	const handleSubmit = async e => {
		e.preventDefault()

		setIsLoading(true)

		// let uploadedFiles = []

		// const filesToBeUploaded = formValue.files.map(file => file.blobFile)

		// if (filesToBeUploaded.length > 0) {
		// 	uploadedFiles = await updateFiles(filesToBeUploaded, [])
		// }

		// const formattedStatus = formValue.status.map(event => ({
		// 	type: event,
		// 	timestamp: new Date().toISOString(),
		// }))

		// const preparedData = {
		// 	...formValue,
		// 	supplier: supplier._id,
		// 	user: userID,
		// 	files: uploadedFiles,
		// 	products: items.map(item => ({
		// 		...item,
		// 		product: item.product._id,
		// 		price: item.product.buyPrice,
		// 	})),
		// 	status: formattedStatus,
		// 	subtotal: cartPriceTotal,
		// 	total: cartPriceTotal + formValue.shippingCost,
		// }

		// const {
		// 	status,
		// 	message,
		// 	data: inventoryOrder,
		// } = await fetcher('/api/inventory-orders/add', {
		// 	method: 'POST',
		// 	body: JSON.stringify(preparedData),
		// 	headers: {
		// 		'Content-type': 'application/json; charset=UTF-8',
		// 	},
		// })

		// if (status === 'success') {
		// 	router.push(`/inventory-orders/${inventoryOrder.orderNumber}`)
		// 	toast.success('Inventory order created.')
		// 	dispatch(emptyCart())
		// } else {
		// 	console.log(message)
		// 	toast.error('Failed to create order.')
		// }

		setIsLoading(false)
	}

	return (
		<Form disabled={isLoading}>
			<Grid fluid>
				<Row style={{ marginBottom: 10 }}>
					<Col xs={24}>
						<InventoryOrderStatusPanel
							status={formValue.status}
							order={order}
							setFormValue={setFormValue}
							editable={
								!order.status.map(event => event.type).includes('cancelled')
							}
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={16}>
						<PanelGroup bordered>
							<Panel header='Order items'>
								{order.products.map(item => (
									<Row key={item.productRef}>
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
															src={item.images[0].url}
															alt={item.title}
															fill
															sizes='(max-width: 768px) 60px, (max-width: 1200px) 60px, 60px'
														/>
													</div>
													<Stack direction='column' alignItems='flex-start'>
														<span style={{ color: '#6CD6FF' }}>{item.title}</span>
														<span>{item.brand.name}</span>
													</Stack>
												</Stack>

												<InputNumber
													value={item.quantity}
													readOnly
													style={{ width: 65 }}
													size='sm'
												/>

												<span>x</span>

												<InputNumber
													value={item.buyPrice}
													formatter={value => `$ ${value}`}
													readOnly
													style={{ width: 100 }}
													size='sm'
												/>

												<span
													style={{
														display: 'flex',
														width: 100,
														justifyContent: 'flex-end',
													}}
												>
													${roundMoney(item.buyPrice * item.quantity)}
												</span>
											</Stack>
										</Col>
									</Row>
								))}

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
												<Text>${roundMoney(order.subtotal)}</Text>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right', marginBottom: 12 }}>
											<Col xs={9}>
												<Text>Shipping</Text>
											</Col>
											<Col xs={15}>
												<Text>${roundMoney(order.shippingCost)}</Text>
											</Col>
										</Row>

										<Row style={{ textAlign: 'right' }}>
											<Col xs={9}>
												<Text>Total</Text>
											</Col>
											<Col xs={15}>
												<Text>${roundMoney(order.total)}</Text>
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
									renderFileInfo={(file, fileElement) => {
										return (
											<HStack
												justifyContent='space-between'
												style={{ width: '100%' }}
											>
												<span>{file.originalName}</span>

												<Button
													appearance='link'
													size='sm'
													style={{ padding: 0, marginRight: 5 }}
													onClick={() => handleFileDownload(file)}
												>
													<FileDownloadIcon />
												</Button>
											</HStack>
										)
									}}
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
						<SupplierCard supplier={order.supplier} isLoading={isLoading} />

						<Stack justifyContent='flex-end' style={{ marginTop: '1em' }}>
							<ButtonToolbar>
								<Button
									appearance='primary'
									onClick={handleSubmit}
									// disabled={enableSubmit}
									loading={isLoading}
								>
									Update order
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
export default InventoryOrderForm
