'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	InputPicker,
	Panel,
	Row,
	Schema,
	Stack,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	getDrawerData,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import { useLocation } from '@/hooks/useLocation'

const { StringType, ObjectType } = Schema.Types

const ManageOrderCustomerDrawer = ({
	setCustomer,
	shipmentMethod,
}) => {
	const model = Schema.Model({
		contact: ObjectType().shape({
			firstName: StringType().isRequired('This field is required.'),
			lastName: StringType().isRequired('This field is required.'),
			phone: StringType().isRequired('This field is required.'),
			email: StringType().isRequired('This field is required.'),
		}),
		billing: ObjectType().shape({
			firstName: StringType().isRequired('This field is required.'),
			lastName: StringType().isRequired('This field is required.'),
			address: StringType().isRequired('This field is required.'),
			town: StringType().isRequired('This field is required.'),
			region: StringType().isRequired('This field is required.'),
			digitalAddress: StringType().isRequired('This field is required.'),
		}),
		shipping: ObjectType().shape({
			firstName:
				shipmentMethod === 'delivery'
					? StringType().isRequired('This field is required.')
					: StringType(),
			lastName:
				shipmentMethod === 'delivery'
					? StringType().isRequired('This field is required.')
					: StringType(),
			address:
				shipmentMethod === 'delivery'
					? StringType().isRequired('This field is required.')
					: StringType(),
			town:
				shipmentMethod === 'delivery'
					? StringType().isRequired('This field is required.')
					: StringType(),
			region:
				shipmentMethod === 'delivery'
					? StringType().isRequired('This field is required.')
					: StringType(),
			digitalAddress:
				shipmentMethod === 'delivery'
					? StringType().isRequired('This field is required.')
					: StringType(),
		}),
	})
	const dispatch = useDispatch()
	const [
		billingRegions,
		billingTowns,
		handleBillingRegion,
		clearBillingTowns,
	] = useLocation()

	const [
		shippingRegions,
		shippingTowns,
		handleShippingRegion,
		clearShippingTowns,
	] = useLocation()
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
		billingActive: true,
		billing: {
			firstName: '',
			lastName: '',
			address: '',
			town: '',
			region: '',
			digitalAddress: '',
		},
		shipping: {
			firstName: '',
			lastName: '',
			address: '',
			town: '',
			region: '',
			digitalAddress: '',
		},
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const customer = useSelector(getDrawerData)

	const updateForm = customer => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					user: customer.user,
					contact: {
						firstName: customer.contact.firstName,
						lastName: customer.contact.lastName,
						email: customer.contact.email,
						phone: customer.contact.phone,
					},
					profileImg: customer?.profileImg || null,
					billingActive: true,
					billing: {
						firstName: customer?.billing?.firstName || '',
						lastName: customer?.billing?.lastName || '',
						address: customer?.billing?.address || '',
						town: customer?.billing?.town || '',
						region: customer?.billing?.region || '',
						digitalAddress: customer?.billing?.digitalAddress || '',
					},
					shipping: {
						firstName: customer?.shipping?.firstName || '',
						lastName: customer?.shipping?.lastName || '',
						address: customer?.shipping?.address || '',
						town: customer?.shipping?.town || '',
						region: customer?.shipping?.region || '',
						digitalAddress: customer?.shipping?.digitalAddress || '',
					},
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
				billingActive: true,
				billing: {
					firstName: '',
					lastName: '',
					address: '',
					town: '',
					region: '',
					digitalAddress: '',
				},
				shipping: {
					firstName: '',
					lastName: '',
					address: '',
					town: '',
					region: '',
					digitalAddress: '',
				},
			})
		}

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		setCustomer({
			...formValue,
			shipping:
				shipmentMethod === 'delivery' ? formValue.shipping : null,
		})

		dispatch(setDrawerClose())
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(customer)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					{isEditing ? 'Update' : 'Add'} customer
				</Drawer.Title>
				<Drawer.Actions>
					<Button
						onClick={() => dispatch(setDrawerClose())}
						startIcon={<CloseIcon />}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						appearance='primary'
						startIcon={<CheckIcon />}
					>
						Save
					</Button>
				</Drawer.Actions>
			</Drawer.Header>
			<Drawer.Body style={{ padding: '1.2em' }}>
				<Form
					nestedField
					ref={formRef}
					onChange={setFormValue}
					onCheck={setFormError}
					formValue={formValue}
					model={model}
				>
					<Stack spacing={16} direction='column' alignItems='stretch'>
						<Panel header='Contact' bordered>
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={12}>
									<Field
										name='contact.firstName'
										label='First name'
										accepter={Input}
										error={formError?.contact?.firstName}
										readOnly={isEditing}
									/>
								</Col>
								<Col xs={12}>
									<Field
										name='contact.lastName'
										label='Last name'
										accepter={Input}
										error={formError?.contact?.lastName}
										readOnly={isEditing}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={12}>
									<Field
										name='contact.email'
										label='Email'
										accepter={Input}
										error={formError?.contact?.email}
										readOnly={isEditing}
									/>
								</Col>
								<Col xs={12}>
									<Field
										name='contact.phone'
										label='Phone'
										accepter={Input}
										error={formError?.contact?.phone}
										readOnly={isEditing}
									/>
								</Col>
							</Row>
						</Panel>

						<Panel header='Billing' bordered>
							<Row style={{ marginBottom: '1.4em' }}>
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

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={12}>
									<Field
										name='billing.region'
										label='Region'
										accepter={InputPicker}
										error={formError?.billing?.region}
										data={billingRegions}
										onSelect={value => handleBillingRegion(value)}
										onChange={() => {
											setFormValue(prev => {
												return {
													...prev,
													billing: { ...formValue.billing, town: '' },
												}
											})
										}}
										onClean={() => {
											clearBillingTowns()
										}}
									/>
								</Col>
								<Col xs={12}>
									<Field
										name='billing.town'
										label='Town'
										accepter={InputPicker}
										error={formError?.billing?.town}
										data={billingTowns}
										disabled={billingTowns.length === 0}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='billing.address'
										label='Address'
										accepter={Input}
										error={formError?.billing?.address}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='billing.digitalAddress'
										label='Digital address'
										accepter={Input}
										error={formError?.billing?.digitalAddress}
									/>
								</Col>
							</Row>
						</Panel>
						{shipmentMethod === 'delivery' && (
							<Panel header='Shipping' bordered>
								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={12}>
										<Field
											name='shipping.firstName'
											label='First name'
											accepter={Input}
											error={formError?.shipping?.firstName}
										/>
									</Col>
									<Col xs={12}>
										<Field
											name='shipping.lastName'
											label='Last name'
											accepter={Input}
											error={formError?.shipping?.lastName}
										/>
									</Col>
								</Row>

								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={12}>
										<Field
											name='shipping.region'
											label='Region'
											accepter={InputPicker}
											error={formError?.shipping?.region}
											data={shippingRegions}
											onSelect={value => handleShippingRegion(value)}
											onChange={() => {
												setFormValue(prev => {
													return {
														...prev,
														shipping: { ...formValue.shipping, town: '' },
													}
												})
											}}
											onClean={() => {
												clearShippingTowns()
											}}
										/>
									</Col>
									<Col xs={12}>
										<Field
											name='shipping.town'
											label='Town'
											accepter={InputPicker}
											error={formError?.shipping?.town}
											data={shippingTowns}
											disabled={shippingTowns.length === 0}
										/>
									</Col>
								</Row>

								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={24}>
										<Field
											name='shipping.address'
											label='Address'
											accepter={Input}
											error={formError?.shipping?.address}
										/>
									</Col>
								</Row>

								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={24}>
										<Field
											name='shipping.digitalAddress'
											label='Digital address'
											accepter={Input}
											error={formError?.shipping?.digitalAddress}
										/>
									</Col>
								</Row>
							</Panel>
						)}
					</Stack>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default ManageOrderCustomerDrawer
