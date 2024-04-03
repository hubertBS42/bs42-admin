'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
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

const { StringType, ObjectType } = Schema.Types

const model = Schema.Model({
	firstName: StringType().isRequired('This field is required.'),
	lastName: StringType().isRequired('This field is required.'),
	phone1: StringType().isRequired('This field is required.'),
	email: StringType().isRequired('This field is required.'),
	billing: ObjectType().shape({
		firstName: StringType().isRequired('This field is required.'),
		lastName: StringType().isRequired('This field is required.'),
		address: StringType().isRequired('This field is required.'),
		town: StringType().isRequired('This field is required.'),
		region: StringType().isRequired('This field is required.'),
		digitalAddress: StringType().isRequired('This field is required.'),
	}),
	shipping: ObjectType().shape({
		firstName: StringType().isRequired('This field is required.'),
		lastName: StringType().isRequired('This field is required.'),
		address: StringType().isRequired('This field is required.'),
		town: StringType().isRequired('This field is required.'),
		region: StringType().isRequired('This field is required.'),
		digitalAddress: StringType().isRequired('This field is required.'),
	}),
})

const ManageOrderCustomerDrawer = ({ setCustomer }) => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		user: '',
		firstName: '',
		lastName: '',
		email: '',
		phone1: '',
		label: '',
		profileImg: null,
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
			isActive: true,
		},
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const customer = useSelector(getDrawerData)

	const updateForm = customer => {
		if (isEditing) {
			const activeShipping = customer.shipping.find(
				address => address.isActive
			)
			setFormValue(prev => {
				return {
					...prev,
					user: customer?._id || '',
					firstName: customer.firstName,
					lastName: customer.lastName,
					email: customer.email,
					phone1: customer.phone1,
					label: customer.label,
					profileImg: customer?.profileImg || null,
					billing: {
						firstName: customer?.billing?.firstName || '',
						lastName: customer?.billing?.lastName || '',
						address: customer?.billing?.address || '',
						town: customer?.billing?.town || '',
						region: customer?.billing?.region || '',
						digitalAddress: customer?.billing?.digitalAddress || '',
					},
					shipping: {
						firstName: activeShipping?.firstName || '',
						lastName: activeShipping?.lastName || '',
						address: activeShipping?.address || '',
						town: activeShipping?.town || '',
						region: activeShipping?.region || '',
						digitalAddress: activeShipping?.digitalAddress || '',
						isActive: true,
					},
				}
			})
		} else {
			setFormValue({
				user: '',
				firstName: '',
				lastName: '',
				email: '',
				phone1: '',
				label: '',
				profileImg: null,
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
					isActive: true,
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
			setCustomer({
				...formValue,
				shipping: [formValue.shipping],
			})
		} else {
			setCustomer({
				...formValue,
				shipping: [formValue.shipping],
				label: `${formValue.firstName} ${formValue.lastName}`,
			})
		}

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
										name='firstName'
										label='First name'
										accepter={Input}
										error={formError?.firstName}
										readOnly={isEditing}
									/>
								</Col>
								<Col xs={12}>
									<Field
										name='lastName'
										label='Last name'
										accepter={Input}
										error={formError?.lastName}
										readOnly={isEditing}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={12}>
									<Field
										name='email'
										label='Email'
										accepter={Input}
										error={formError?.email}
										readOnly={isEditing}
									/>
								</Col>
								<Col xs={12}>
									<Field
										name='phone1'
										label='Phone'
										accepter={Input}
										error={formError?.phone1}
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
					</Stack>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default ManageOrderCustomerDrawer
