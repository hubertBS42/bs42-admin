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
	Uploader,
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
import TextArea from '../TextArea/TextArea'
import {
	displayValidationError,
	processFormErrors,
} from '@/utils/functions'
import ImagesUploader from '../ImagesUploader/ImagesUploader'

const { StringType, ObjectType, ArrayType } = Schema.Types

const model = Schema.Model({
	accountID: StringType(),
	vatID: StringType(),
	name: StringType().isRequired('You must provide a name.'),
	notes: StringType(),
	website: ObjectType().shape({
		company: StringType(),
		alibaba: StringType(),
	}),
	logo: ArrayType().minLength(
		1,
		'You need to upload at least 1 image.'
	),
	contact: ObjectType().shape({
		firstName: StringType(),
		lastName: StringType(),
		email: StringType(),
		primaryPhone: StringType(),
		secondaryPhone: StringType(),
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
	const [imagesToBeDeleted, setImagesToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		accountID: '',
		vatID: '',
		name: '',
		notes: '',
		website: {
			company: '',
			alibaba: '',
		},
		logo: [],
		contact: {
			firstName: '',
			lastName: '',
			email: '',
			primaryPhone: '',
			secondaryPhone: '',
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
		setFormError({})
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					accountID: supplier?.accountID || '',
					vatID: supplier?.vatID || '',
					name: supplier?.name || '',
					notes: supplier?.notes || '',
					website: {
						company: supplier?.website?.company || '',
						alibaba: supplier?.website?.alibaba || '',
					},
					logo: supplier.logo ? [supplier.logo] : [],
					contact: {
						firstName: supplier?.contact?.firstName || '',
						lastName: supplier?.contact?.lastName || '',
						email: supplier?.contact?.email || '',
						primaryPhone: supplier?.contact?.primaryPhone || '',
						secondaryPhone: supplier?.contact?.secondaryPhone || '',
						fax: supplier?.contact?.fax || '',
					},
					address: {
						line1: supplier?.address?.line1 || '',
						line2: supplier?.address?.line2 || '',
						townCity: supplier?.address?.townCity || '',
						stateCounty: supplier?.address?.stateCounty || '',
						country: supplier?.address?.country || '',
						postCode: supplier?.address?.postCode || '',
					},
					isActive: supplier?.isActive || true,
				}
			})
		} else {
			setFormValue({
				accountID: '',
				vatID: '',
				name: '',
				notes: '',
				website: {
					company: '',
					alibaba: '',
				},
				logo: [],
				contact: {
					firstName: '',
					lastName: '',
					email: '',
					primaryPhone: '',
					secondaryPhone: '',
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
			await updateSupplier(supplier, formValue, imagesToBeDeleted)
			setImagesToBeDeleted([])
		} else {
			//create
			await createSupplier(formValue)
		}
	}

	const grabRemovedImages = file => {
		setImagesToBeDeleted(prev => {
			return [...prev, file.name]
		})
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(supplier)}
			backdrop='static'
			size='lg'
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
					onCheck={e => {
						const data = processFormErrors(e, formError)
						setFormError(data)
					}}
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
									error={displayValidationError(formError?.accountID)}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='vatID'
									label='VAT ID'
									accepter={Input}
									error={displayValidationError(formError?.vatID)}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='name'
									label='Name'
									accepter={Input}
									error={displayValidationError(formError?.name)}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={24}>
								<ImagesUploader
									name='logo'
									accepter={Uploader}
									error={displayValidationError(formError?.logo)}
									multiple
									listType='picture'
									action='//jsonplaceholder.typicode.com/posts/'
									defaultFileList={
										isEditing && supplier.logo ? [supplier.logo] : []
									}
									autoUpload={false}
									label='Logo'
									maxImages={1}
									noOfImages={formValue.logo.length}
									disabled={formValue.logo.length === 1}
									onRemove={grabRemovedImages}
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
													error={displayValidationError(
														formError?.contact?.object?.firstName
													)}
												/>
											</Col>
											<Col xs={12}>
												<Field
													name='contact.lastName'
													label='Last name'
													accepter={Input}
													error={displayValidationError(
														formError?.contact?.object?.lastName
													)}
												/>
											</Col>
										</Row>

										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={12}>
												<Field
													name='contact.email'
													label='Email'
													accepter={Input}
													error={displayValidationError(
														formError?.contact?.object?.email
													)}
												/>
											</Col>

											<Col xs={12}>
												<Field
													name='contact.fax'
													label='Fax'
													accepter={Input}
													error={displayValidationError(
														formError?.contact?.object?.fax
													)}
												/>
											</Col>
										</Row>

										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={12}>
												<Field
													name='contact.primaryPhone'
													label='Primary number'
													accepter={Input}
													error={displayValidationError(
														formError?.contact?.object?.primaryPhone
													)}
												/>
											</Col>
											<Col xs={12}>
												<Field
													name='contact.secondaryPhone'
													label='Secondary number'
													accepter={Input}
													error={displayValidationError(
														formError?.contact?.object?.secondaryPhone
													)}
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
													error={displayValidationError(
														formError?.address?.object?.line1
													)}
												/>
											</Col>
											<Col xs={12}>
												<Field
													name='address.line2'
													label='Address line 2'
													accepter={Input}
													error={displayValidationError(
														formError?.address?.object?.line2
													)}
												/>
											</Col>
										</Row>

										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={12}>
												<Field
													name='address.townCity'
													label='Town or City'
													accepter={Input}
													error={displayValidationError(
														formError?.address?.object?.townCity
													)}
												/>
											</Col>

											<Col xs={12}>
												<Field
													name='address.stateCounty'
													label='State or County'
													accepter={Input}
													error={displayValidationError(
														formError?.address?.object?.stateCounty
													)}
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
													error={displayValidationError(
														formError?.address?.object?.country
													)}
												/>
											</Col>
											<Col xs={12}>
												<Field
													name='address.postCode'
													label='Post code'
													accepter={Input}
													error={displayValidationError(
														formError?.address?.object?.postCode
													)}
												/>
											</Col>
										</Row>
									</Tabs.Tab>
									<Tabs.Tab eventKey='3' title='Website'>
										<Row style={{ marginBottom: '1.4em' }}>
											<Col xs={24}>
												<Field
													name='website.company'
													label='Company URL'
													accepter={Input}
													error={displayValidationError(
														formError?.website?.object?.company
													)}
												/>
											</Col>
										</Row>

										<Row>
											<Col xs={24}>
												<Field
													name='website.alibaba'
													label='Alibaba URL'
													accepter={Input}
													error={displayValidationError(
														formError?.website?.object?.alibaba
													)}
												/>
											</Col>
										</Row>
									</Tabs.Tab>
									<Tabs.Tab eventKey='4' title='Transactions'></Tabs.Tab>
									<Tabs.Tab eventKey='5' title='Notes'>
										<Row>
											<Col xs={24}>
												<Field
													name='notes'
													label='Notes'
													accepter={TextArea}
													error={displayValidationError(formError?.notes)}
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
