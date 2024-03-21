'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Divider,
	Drawer,
	Form,
	Input,
	InputPicker,
	Panel,
	PanelGroup,
	Row,
	Schema,
	SelectPicker,
} from 'rsuite'

import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner'

import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createOrder,
	updateOrder,
} from '@/redux/features/orders/ordersActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import { getCurrentRate } from '@/redux/features/orders/ordersSlice'
import { useUsers } from '@/hooks/useUsers'

const { StringType, ObjectType } = Schema.Types

const model = Schema.Model({
	user: StringType(),
	contact: ObjectType().shape({
		firstName: StringType(),
		lastName: StringType(),
		email: StringType(),
		phone: StringType(),
	}),
	billing: ObjectType().shape({
		firstName: StringType(),
		lastName: StringType(),
		region: StringType(),
		town: StringType(),
		address: StringType(),
		digitalAddress: StringType(),
	}),
	status: StringType(),
	shipping: ObjectType().shape({
		firstName: StringType(),
		lastName: StringType(),
		region: StringType(),
		town: StringType(),
		address: StringType(),
		digitalAddress: StringType(),
		method: StringType(),
	}),
	payment: ObjectType().shape({
		method: StringType(),
	}),
	trackingInfo: ObjectType().shape({
		carrier: StringType(),
		trackingNumber: StringType(),
	}),
})

const OrdersDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		user: '',
		contact: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
		},
		billing: {
			firstName: '',
			lastName: '',
			region: '',
			town: '',
			address: '',
			digitalAddress: '',
		},
		status: 'pending',
		rate: 0,
		products: [],
		totalPrice: 0,
		shipping: {
			firstName: '',
			lastName: '',
			region: '',
			town: '',
			address: '',
			digitalAddress: '',
			method: '',
			status: 'pending',
		},
		payment: {
			method: '',
			status: 'pending',
		},
		trackingInfo: {
			carrier: '',
			trackingNumber: '',
		},
		coupons: [],
		notes: '',
		returnInfo: {
			requested: false,
			reason: '',
			status: 'pending',
		},
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const order = useSelector(getDrawerData)
	const rate = useSelector(getCurrentRate)
	const [users, loading, searchUsers] = useUsers()

	const updateForm = order => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					status: order.status,
					notes: order.notes,
				}
			})
		} else {
			setFormValue({
				user: '',
				contact: {
					firstName: '',
					lastName: '',
					email: '',
					phone: '',
				},
				billing: {
					firstName: '',
					lastName: '',
					region: '',
					town: '',
					address: '',
					digitalAddress: '',
				},
				status: 'pending',
				rate,
				products: [],
				totalPrice: 0,
				shipping: {
					firstName: '',
					lastName: '',
					region: '',
					town: '',
					address: '',
					digitalAddress: '',
					method: '',
					status: 'pending',
				},
				payment: {
					method: '',
					status: 'pending',
				},
				trackingInfo: {
					carrier: '',
					trackingNumber: '',
				},
				coupons: [],
				notes: '',
				returnInfo: {
					requested: false,
					reason: '',
					status: 'pending',
				},
			})
		}

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (isEditing) {
			//update
			await updateOrder(order, formValue)
		} else {
			//create
			await createOrder(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(order)}
			backdrop='static'
			size='lg'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					{isEditing ? 'Manage' : 'Create'} Order
				</Drawer.Title>
				<Drawer.Actions>
					<Button
						onClick={() => dispatch(setDrawerClose())}
						startIcon={<CloseIcon />}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						appearance='primary'
						startIcon={<CheckIcon />}
						disabled={isLoading}
						loading={isLoading}
					>
						Save
					</Button>
				</Drawer.Actions>
			</Drawer.Header>
			<Drawer.Body style={{ padding: '1.2em' }}>
				<Form
					ref={formRef}
					onChange={setFormValue}
					onCheck={setFormError}
					formValue={formValue}
					model={model}
					disabled={isLoading}
					nestedField
				>
					<Row style={{ marginBottom: 10 }}>
						<Col xs={24}>
							<Field
								name='status'
								label='Order status'
								accepter={SelectPicker}
								data={[
									{ label: 'Pending', value: 'pending' },
									{ label: 'Processing', value: 'processing' },
									{ label: 'Shipped', value: 'shipped' },
									{ label: 'Completed', value: 'completed' },
									{ label: 'Cancelled', value: 'cancelled' },
								]}
								disabledItemValues={['pending']}
								disabled={
									order?.status === 'cancelled' ||
									order?.status === 'completed'
								}
								cleanable={false}
								searchable={false}
							/>
						</Col>
					</Row>

					<Row style={{ marginBottom: 10 }}>
						<Col xs={24}>
							<Field
								name='customerInfo.userRef'
								accepter={InputPicker}
								placeholder='Search user'
								data={users}
								onSearch={searchUsers}
								onSelect={(value, item) => console.log(item)}
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
						</Col>
					</Row>

					<Panel
						header={
							<span style={{ fontSize: 20, fontWeight: 500 }}>
								Customer Details
							</span>
						}
						bordered
						style={{ marginBottom: '1.8em' }}
					>
						<Panel
							header={
								<span style={{ fontSize: 17 }}>Contact Information</span>
							}
							bordered
							style={{ marginBottom: '1.8em' }}
						>
							<Row style={{ marginBottom: '1em' }}>
								<Col xs={12}>
									<Field
										name='contact.firstName'
										label='First name'
										accepter={Input}
										error={formError?.contact?.firstName}
									/>
								</Col>

								<Col xs={12}>
									<Field
										name='contact.lastName'
										label='Last name'
										accepter={Input}
										error={formError?.contact?.lastName}
									/>
								</Col>
							</Row>

							<Row>
								<Col xs={12}>
									<Field
										name='contact.email'
										label='Email'
										accepter={Input}
										error={formError?.contact?.email}
									/>
								</Col>

								<Col xs={12}>
									<Field
										name='contact.phone'
										label='Phone'
										accepter={Input}
										error={formError?.contact?.phone}
									/>
								</Col>
							</Row>
						</Panel>

						<Panel
							header={
								<span style={{ fontSize: 17 }}>Billing Information</span>
							}
							bordered
							style={{ marginBottom: '1.8em' }}
						>
							<Row style={{ marginBottom: '1em' }}>
								<Col xs={12}>
									<Field
										name='billing.firstName'
										label='First name'
										accepter={Input}
										error={formError?.billing?.firstName}
									/>
								</Col>

								<Col xs={12}>
									<Field
										name='billing.lastName'
										label='Last name'
										accepter={Input}
										error={formError?.billing?.lastName}
									/>
								</Col>
							</Row>
							<Row style={{ marginBottom: '1em' }}>
								<Col xs={12}>
									<Field
										name='billing.region'
										label='Region'
										accepter={Input}
										error={formError?.billing?.region}
									/>
								</Col>

								<Col xs={12}>
									<Field
										name='billing.town'
										label='Town'
										accepter={Input}
										error={formError?.billing?.town}
									/>
								</Col>
							</Row>

							<Row>
								<Col xs={12}>
									<Field
										name='billing.address'
										label='Address'
										accepter={Input}
										error={formError?.billing?.address}
									/>
								</Col>

								<Col xs={12}>
									<Field
										name='billing.digitalAddress'
										label='Digital address'
										accepter={Input}
										error={formError?.billing?.digitalAddress}
									/>
								</Col>
							</Row>
						</Panel>

						<Panel
							header={
								<span style={{ fontSize: 17 }}>Shipping Information</span>
							}
							bordered
							style={{ marginBottom: '1.8em' }}
						>
							<Row style={{ marginBottom: '1em' }}>
								<Col xs={12}>
									<Field
										name='shipping.firstName'
										label='Region'
										accepter={Input}
										error={formError?.shipping?.region}
									/>
								</Col>

								<Col xs={12}>
									<Field
										name='shipping.town'
										label='Town'
										accepter={Input}
										error={formError?.shipping?.town}
									/>
								</Col>
							</Row>

							<Row>
								<Col xs={12}>
									<Field
										name='shipping.address'
										label='Address'
										accepter={Input}
										error={formError?.shipping?.address}
									/>
								</Col>

								<Col xs={12}>
									<Field
										name='shipping.digitalAddress'
										label='Digital address'
										accepter={Input}
										error={formError?.shipping?.digitalAddress}
									/>
								</Col>
							</Row>
						</Panel>
					</Panel>

					{/* <Panel
						header='Billing Information'
						bordered
						style={{ marginBottom: '1.8em' }}
					>
						<Row style={{ marginBottom: '1em' }}>
							<Col xs={12}>
								<Field
									name='customerInfo.region'
									label='Region'
									accepter={Input}
									error={formError?.customerInfo?.region}
								/>
							</Col>

							<Col xs={12}>
								<Field
									name='customerInfo.town'
									label='Town'
									accepter={Input}
									error={formError?.customerInfo?.town}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={12}>
								<Field
									name='customerInfo.address'
									label='Address'
									accepter={Input}
									error={formError?.customerInfo?.address}
								/>
							</Col>

							<Col xs={12}>
								<Field
									name='customerInfo.digitalAddress'
									label='Digital address'
									accepter={Input}
									error={formError?.customerInfo?.digitalAddress}
								/>
							</Col>
						</Row>
					</Panel> */}
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default OrdersDrawer
