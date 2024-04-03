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
	getDrawerLoadingState,
	getDrawerOpenState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import { capitalizeFirstLetter } from '@/utils/functions'

const { StringType, ObjectType } = Schema.Types

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
		firstName: StringType().isRequired('This field is required.'),
		lastName: StringType().isRequired('This field is required.'),
		address: StringType().isRequired('This field is required.'),
		town: StringType().isRequired('This field is required.'),
		region: StringType().isRequired('This field is required.'),
		digitalAddress: StringType().isRequired('This field is required.'),
	}),
})

const AddCustomerDrawer = ({ open, closeDrawer }) => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		contact: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
		},
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

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		closeDrawer()
	}

	return (
		<Drawer open={open} onClose={closeDrawer} backdrop='static'>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>Add customer</Drawer.Title>
				<Drawer.Actions>
					<Button onClick={closeDrawer} startIcon={<CloseIcon />}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						appearance='primary'
						startIcon={<CheckIcon />}
					>
						Add
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

							<Row style={{ marginBottom: '1.4em' }}>
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
export default AddCustomerDrawer
