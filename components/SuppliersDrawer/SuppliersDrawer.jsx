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
	Tabs,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'
import { countries } from '@/utils/data'

import {
	createSupplier,
	updateSupplier,
} from '@/redux/features/suppliers/suppliersActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import { formatData } from '@/utils/functions'
import TextArea from '../TextArea/TextArea'

const { StringType, ObjectType } = Schema.Types

const model = Schema.Model({
	accountID: StringType(),
	vatID: StringType(),
	name: StringType().isRequired('You must provide a name.'),
	notes: StringType(),
	contact: ObjectType().shape({
		firstName: StringType(),
		lastName: StringType(),
		email: StringType(),
		phone1: StringType(),
		phone2: StringType(),
		fax: StringType(),
	}),
	address: ObjectType().shape({
		line1: StringType(),
		line2: StringType(),
		townCity: StringType(),
		stateCounty: StringType(),
		country: StringType(),
		postCode: StringType(),
	}),
})

const formattedCountries = countries.map(country => ({
	label: country.name,
	value: country.name,
}))

const SuppliersDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		accountID: '',
		vatID: '',
		name: '',
		notes: '',
		contact: {
			firstName: '',
			lastName: '',
			email: '',
			phone1: '',
			phone2: '',
			fax: '',
		},
		address: {
			line1: '',
			line2: '',
			townCity: '',
			stateCounty: '',
			country: '',
			postCode: '',
		},
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const supplier = useSelector(getDrawerData)

	const updateForm = supplier => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					accountID: supplier.accountID,
					vatID: supplier.vatID,
					name: supplier.name,
					notes: supplier.notes,
					contact: {
						firstName: supplier.contact.firstName,
						lastName: supplier.contact.lastName,
						email: supplier.contact.email,
						phone1: supplier.contact.phone1,
						phone2: supplier.contact.phone2,
						fax: supplier.contact.fax,
					},
					address: {
						line1: supplier.address.line1,
						line2: supplier.address.line2,
						townCity: supplier.address.townCity,
						stateCounty: supplier.address.stateCounty,
						country: supplier.address.country,
						postCode: supplier.address.postCode,
					},
					isActive: supplier.isActive,
				}
			})
		} else {
			setFormValue({
				accountID: '',
				vatID: '',
				name: '',
				notes: '',
				contact: {
					firstName: '',
					lastName: '',
					email: '',
					phone1: '',
					phone2: '',
					fax: '',
				},
				address: {
					line1: '',
					line2: '',
					townCity: '',
					stateCounty: '',
					country: '',
					postCode: '',
				},
				isActive: true,
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
			await updateSupplier(supplier, formValue)
		} else {
			//create
			await createSupplier(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(supplier)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Supplier</Drawer.Title>
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
					<CustomToggle accepter={Toggle} name='isActive' label='Active' />

					<Panel bordered>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='accountID'
									label='Account ID'
									accepter={Input}
									error={formError.accountID}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='vatID'
									label='VAT ID'
									accepter={Input}
									error={formError.vatID}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='name'
									label='Name'
									accepter={Input}
									error={formError.name}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Tabs defaultActiveKey='1'>
									<Tabs.Tab eventKey='1' title='Contact'>
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
													name='contact.fax'
													label='Fax'
													accepter={Input}
													error={formError?.contact?.fax}
												/>
											</Col>
										</Row>

										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={12}>
												<Field
													name='contact.phone1'
													label='Phone 1'
													accepter={Input}
													error={formError?.contact?.phone1}
												/>
											</Col>
											<Col xs={12}>
												<Field
													name='contact.phone2'
													label='Phone 2'
													accepter={Input}
													error={formError?.contact?.phone2}
												/>
											</Col>
										</Row>
									</Tabs.Tab>
									<Tabs.Tab eventKey='2' title='Address'>
										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={12}>
												<Field
													name='address.line1'
													label='Address line 1'
													accepter={Input}
													error={formError?.address?.line1}
												/>
											</Col>
											<Col xs={12}>
												<Field
													name='address.line2'
													label='Address line 2'
													accepter={Input}
													error={formError?.address?.line2}
												/>
											</Col>
										</Row>

										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={12}>
												<Field
													name='address.townCity'
													label='Town or City'
													accepter={Input}
													error={formError?.address?.townCity}
												/>
											</Col>

											<Col xs={12}>
												<Field
													name='address.stateCounty'
													label='State or County'
													accepter={Input}
													error={formError?.address?.stateCounty}
												/>
											</Col>
										</Row>

										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={12}>
												<Field
													name='address.country'
													label='Country'
													accepter={InputPicker}
													data={formattedCountries}
													error={formError?.address?.country}
												/>
											</Col>
											<Col xs={12}>
												<Field
													name='address.postCode'
													label='Post code'
													accepter={Input}
													error={formError?.address?.postCode}
												/>
											</Col>
										</Row>
									</Tabs.Tab>
									<Tabs.Tab eventKey='3' title='Transactions'></Tabs.Tab>
									<Tabs.Tab eventKey='4' title='Notes'>
										<Row>
											<Col xs={24}>
												<Field
													name='notes'
													label='Notes'
													accepter={TextArea}
													error={formError.notes}
													value={formValue.notes}
												/>
											</Col>
										</Row>
									</Tabs.Tab>
								</Tabs>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default SuppliersDrawer
