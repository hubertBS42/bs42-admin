import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	IconButton,
	Input,
	InputPicker,
	Panel,
	Row,
	Schema,
	SelectPicker,
	Stack,
	Text,
	Toggle,
	Uploader,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import PlusIcon from '@rsuite/icons/Plus'

import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createUser,
	updateUser,
} from '@/redux/features/users/usersActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import ImagesUploader from '../ImagesUploader/ImagesUploader'
import TextArea from '../TextArea/TextArea'
import { selectAllRoles } from '@/redux/features/roles/rolesSlice'
import {
	displayValidationError,
	formatData,
	generatePassword,
	processFormErrors,
} from '@/utils/functions'
import DeliveryAddresses from '../DeliveryAddresses/DeliveryAddresses'
import GeneratePasswordField from '../GeneratePasswordField/GeneratePasswordField'
import { useLocation } from '@/hooks/useLocation'
import ShippingAddressPanel from '../ShippingAddressPanel/ShippingAddressPanel'
import { nanoid } from '@reduxjs/toolkit'

const { StringType, ArrayType, ObjectType, BooleanType } =
	Schema.Types

const UsersDrawer = () => {
	const dispatch = useDispatch()

	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [imageToBeDeleted, setImageToBeDeleted] = useState([])
	const [disabledShippingAdd, setDisabledShippingAdd] = useState(false)
	const [formValue, setFormValue] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone1: '',
		phone2: '',
		billingActive: false,
		billing: {
			firstName: '',
			lastName: '',
			email: '',
			region: '',
			town: '',
			address: '',
		},
		company: {
			name: '',
			phone: '',
			website: '',
			region: '',
			town: '',
			address: '',
		},
		shipping: [],
		profileImg: [],
		password: '',
		role: '',
		notes: '',
		isActive: true,
		canReceiveEmails: true,
	})

	const model = Schema.Model({
		firstName: StringType().isRequired(
			"You must provide user's first name."
		),
		lastName: StringType().isRequired(
			"You must provide user's last name."
		),
		email: StringType().isRequired(
			'You must provide an email address.'
		),
		phone1: StringType().isRequired(
			'You must provide a valid phone number.'
		),
		phone2: StringType(),
		billing: ObjectType().shape({
			firstName: formValue.billingActive
				? StringType().isRequired('You must provide a first name.')
				: StringType(),
			lastName: formValue.billingActive
				? StringType().isRequired('You must provide a last name.')
				: StringType(),
			email: formValue.billingActive
				? StringType().isRequired('You must provide an email address.')
				: StringType(),
			region: formValue.billingActive
				? StringType().isRequired('You must provide a region.')
				: StringType(),
			town: formValue.billingActive
				? StringType().isRequired('You must provide a town.')
				: StringType(),
			address: formValue.billingActive
				? StringType().isRequired('You must provide an address.')
				: StringType(),
		}),
		company: ObjectType().shape({
			name: StringType(),
			phone: StringType(),
			website: StringType(),
			region: StringType(),
			town: StringType(),
			address: StringType(),
			digitalAddress: StringType(),
		}),
		shipping: ArrayType().of(
			ObjectType().shape({
				firstName: StringType().isRequired(
					'You must provide a first name.'
				),
				lastName: StringType().isRequired(
					'You must provide a last name.'
				),
				phone: StringType().isRequired(
					'You must provide a phone number.'
				),
				region: StringType().isRequired('You must provide a region.'),
				town: StringType().isRequired('You must provide a town.'),
				address: StringType().isRequired('You must provide an address.'),
			})
		),
		notes: StringType(),
		profileImg: ArrayType(),
		role: StringType().isRequired(
			'You must assign a role to this user.'
		),
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const user = useSelector(getDrawerData)

	const [
		companyRegions,
		companyTowns,
		handleCompanyRegion,
		clearCompanyTowns,
	] = useLocation()

	const [
		billingRegions,
		billingTowns,
		handleBillingRegion,
		clearBillingTowns,
	] = useLocation()

	const roles = formatData(useSelector(selectAllRoles))

	const updateForm = user => {
		setFormError({})
		if (isEditing) {
			if (user?.billing?.region)
				handleBillingRegion(user?.billing?.region)

			if (user?.company?.region)
				handleCompanyRegion(user?.company?.region)
			setFormValue(prev => {
				return {
					...prev,
					firstName: user.firstName || '',
					lastName: user.lastName || '',
					email: user.email || '',
					phone1: user.phone1 || '',
					phone2: user.phone2 || '',
					address: user?.residentialAddress?.address || '',
					billingActive: user.billingActive,
					billing: {
						firstName: user?.billing?.firstName || '',
						lastName: user?.billing?.lastName || '',
						region: user?.billing?.region || '',
						town: user?.billing?.town || '',
						address: user?.billing?.address || '',
						email: user?.billing?.email || '',
					},
					company: {
						name: user?.company?.name || '',
						phone: user?.company?.phone || '',
						website: user?.company?.website || '',
						region: user?.company?.region || '',
						town: user?.company?.town || '',
						address: user?.company?.address || '',
					},
					shipping: user?.shipping,
					password: '',
					role: user.role._id,
					profileImg: user.profileImg ? [user.profileImg] : [],
					notes: user.notes,
					isActive: user.isActive,
					canReceiveEmails: user.canReceiveEmails,
				}
			})
		} else {
			setFormValue({
				firstName: '',
				lastName: '',
				email: '',
				phone1: '',
				phone2: '',
				billingActive: false,
				billing: {
					firstName: '',
					lastName: '',
					email: '',
					region: '',
					town: '',
					address: '',
				},
				company: {
					name: '',
					phone: '',
					website: '',
					region: '',
					town: '',
					address: '',
				},
				shipping: [],
				profileImg: [],
				password: '',
				role: '',
				notes: '',
				isActive: true,
				canReceiveEmails: true,
			})
		}

		return
	}

	const passwordRule = isEditing
		? Schema.Types.StringType()
		: Schema.Types.StringType().isRequired(
				'You must provide a password.'
		  )

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (isEditing) {
			//update
			await updateUser(user, formValue, imageToBeDeleted)
			setImageToBeDeleted([])
		} else {
			//create
			console.log(formValue)
			await createUser(formValue)
		}
	}

	const grabRemovedImage = file => {
		setImageToBeDeleted(prev => {
			return [...prev, file.name]
		})
	}

	const handlePassword = () => {
		const randPassword = generatePassword({
			useSymbols: true,
			useNumbers: true,
			useLowerCase: true,
			useUpperCase: true,
			passwordLength: 10,
		})

		setFormError(prev => ({ ...prev, password: null }))

		setFormValue(prev => {
			return { ...prev, password: randPassword }
		})
	}

	const handleAddShippingAddress = () => {
		setDisabledShippingAdd(true)
		const index = nanoid()
		setFormValue(prev => {
			return {
				...prev,
				shipping: [
					...formValue.shipping,
					{
						index,
						firstName: '',
						lastName: '',
						address: '',
						phone: '',
						town: '',
						region: '',
						isPrimary: formValue.shipping.length >= 1 ? false : true,
					},
				],
			}
		})
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(user)}
			backdrop='static'
			size='lg'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} User</Drawer.Title>
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
					<Panel
						header={
							<Stack justifyContent='space-between'>
								<span>General Information</span>

								<Stack spacing={30}>
									<CustomToggle
										accepter={Toggle}
										name='isActive'
										label='Active'
									/>

									<CustomToggle
										accepter={Toggle}
										name='canReceiveEmails'
										label='Emails'
									/>
								</Stack>
							</Stack>
						}
						bordered
						style={{ marginBottom: '1.8em' }}
					>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='firstName'
									label='First name'
									accepter={Input}
									error={displayValidationError(formError?.firstName)}
								/>
							</Col>

							<Col xs={12}>
								<Field
									name='lastName'
									label='Last name'
									accepter={Input}
									error={displayValidationError(formError?.lastName)}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='email'
									label='Email'
									accepter={Input}
									error={displayValidationError(formError?.email)}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='password'
									label='Password'
									type='password'
									accepter={Input}
									rule={passwordRule}
									handlePassword={handlePassword}
									error={displayValidationError(formError?.password)}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='phone1'
									label='Primary phone'
									accepter={Input}
									error={displayValidationError(formError?.phone1)}
								/>
							</Col>

							<Col xs={12}>
								<Field
									name='phone2'
									label='Secondary phone'
									accepter={Input}
									error={displayValidationError(formError?.phone2)}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='role'
									label='Role'
									accepter={SelectPicker}
									error={displayValidationError(formError?.role)}
									data={roles}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='notes'
									label='Notes'
									accepter={TextArea}
									error={displayValidationError(formError?.notes)}
									value={formValue.description}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={24}>
								<ImagesUploader
									name='profileImg'
									accepter={Uploader}
									error={displayValidationError(formError?.profileImg)}
									multiple
									listType='picture'
									action='//jsonplaceholder.typicode.com/posts/'
									defaultFileList={
										isEditing && user.profileImg ? [user.profileImg] : []
									}
									autoUpload={false}
									label='Profile Image'
									maxImages={1}
									noOfImages={formValue.profileImg.length}
									disabled={formValue.profileImg.length === 1}
									onRemove={grabRemovedImage}
								/>
							</Col>
						</Row>
					</Panel>

					<Panel
						header='Company Information'
						bordered
						style={{ marginBottom: '1.8em' }}
					>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='company.name'
									label='Name'
									accepter={Input}
									error={displayValidationError(
										formError?.company?.object?.name
									)}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='company.phone'
									label='Phone'
									accepter={Input}
									error={displayValidationError(
										formError?.company?.object?.phone
									)}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='company.website'
									label='Website'
									accepter={Input}
									error={displayValidationError(
										formError?.company?.object?.website
									)}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='company.region'
									label='Region'
									accepter={InputPicker}
									error={displayValidationError(
										formError?.company?.object?.region
									)}
									data={companyRegions}
									onSelect={value => handleCompanyRegion(value)}
									onChange={() => {
										setFormValue(prev => {
											return {
												...prev,
												company: { ...formValue.company, town: '' },
											}
										})
									}}
									onClean={() => {
										clearCompanyTowns()
									}}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='company.town'
									label='Town'
									accepter={InputPicker}
									error={displayValidationError(
										formError?.company?.object?.town
									)}
									data={companyTowns}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={24}>
								<Field
									name='company.address'
									label='Address'
									accepter={Input}
									error={displayValidationError(
										formError?.company?.object?.address
									)}
								/>
							</Col>
						</Row>
					</Panel>

					<Panel
						header={
							<Stack justifyContent='space-between'>
								<span>Billing address</span>
								<CustomToggle accepter={Toggle} name='billingActive' />
							</Stack>
						}
						bordered
						style={{ marginBottom: '1.8em' }}
					>
						{formValue.billingActive && (
							<>
								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={12}>
										<Field
											name='billing.firstName'
											label='First name'
											accepter={Input}
											error={displayValidationError(
												formError?.billing?.object?.firstName
											)}
										/>
									</Col>

									<Col xs={12}>
										<Field
											name='billing.lastName'
											label='Last name'
											accepter={Input}
											error={displayValidationError(
												formError?.billing?.object?.lastName
											)}
										/>
									</Col>
								</Row>

								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={24}>
										<Field
											name='billing.email'
											label='Email'
											accepter={Input}
											error={displayValidationError(
												formError?.billing?.object?.email
											)}
										/>
									</Col>
								</Row>

								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={12}>
										<Field
											name='billing.region'
											label='Region'
											accepter={InputPicker}
											error={displayValidationError(
												formError?.billing?.object?.region
											)}
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
											error={displayValidationError(
												formError?.billing?.object?.town
											)}
											data={billingTowns}
										/>
									</Col>
								</Row>

								<Row>
									<Col xs={24}>
										<Field
											name='billing.address'
											label='Address'
											accepter={Input}
											error={displayValidationError(
												formError?.billing?.object?.address
											)}
										/>
									</Col>
								</Row>
							</>
						)}
					</Panel>

					<Panel
						header={
							<Stack justifyContent='space-between'>
								<span>Shipping Addresses</span>
								<IconButton
									icon={<PlusIcon />}
									circle
									size='xs'
									appearance='primary'
									onClick={handleAddShippingAddress}
									disabled={disabledShippingAdd}
								/>
							</Stack>
						}
						bordered
					>
						{formValue.shipping.length > 0 ? (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									rowGap: '1.5em',
								}}
							>
								{formValue.shipping.map((address, i) => (
									<ShippingAddressPanel
										key={address.index}
										address={address}
										setFormValue={setFormValue}
										formValue={formValue}
										setDisabled={setDisabledShippingAdd}
										i={i}
										errors={
											formError?.shipping?.hasError
												? formError.shipping.array
												: []
										}
									/>
								))}
							</div>
						) : (
							<Text
								align='center'
								muted
								size='sm'
								style={{ marginTop: '1em', marginBottom: '2em' }}
							>
								There are no shipping addresses for this user.
							</Text>
						)}
					</Panel>

					{/* <DeliveryAddresses
						addresses={formValue.shipping}
						setFormValue={setFormValue}
					/> */}
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default UsersDrawer
