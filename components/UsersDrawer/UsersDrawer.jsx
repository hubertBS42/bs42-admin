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
	SelectPicker,
	Stack,
	Toggle,
	Uploader,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
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
import { regions } from '@/utils/data'
import { selectAllRoles } from '@/redux/features/roles/rolesSlice'
import { formatData, generatePassword } from '@/utils/functions'
import DeliveryAddresses from '../DeliveryAddresses/DeliveryAddresses'
import GeneratePasswordField from '../GeneratePasswordField/GeneratePasswordField'

const { StringType, ArrayType, ObjectType } = Schema.Types

const model = Schema.Model({
	firstName: StringType().isRequired(
		"You must provide user's first name."
	),
	lastName: StringType(),
	email: StringType().isRequired('You must provide an email address.'),
	phone1: StringType(),
	phone2: StringType(),
	billing: ObjectType().shape({
		firstName: StringType(),
		lastName: StringType(),
		region: StringType(),
		town: StringType(),
		address: StringType(),
		digitalAddress: StringType(),
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
	notes: StringType(),
	profileImg: ArrayType(),
	role: StringType().isRequired(
		'You must assign a role to this user.'
	),
})

const UsersDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [imageToBeDeleted, setImageToBeDeleted] = useState([])
	const [formValue, setFormValue] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone1: '',
		phone2: '',
		billing: {
			firstName: '',
			lastName: '',
			region: '',
			town: '',
			address: '',
			digitalAddress: '',
		},
		company: {
			name: '',
			phone: '',
			website: '',
			region: '',
			town: '',
			address: '',
			digitalAddress: '',
		},
		shipping: [],
		profileImg: [],
		password: '',
		role: '',
		notes: '',
		isActive: true,
		isApproved: false,
		canReceiveEmails: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const user = useSelector(getDrawerData)
	const formattedRegions = regions.map(region => {
		return { label: region.name, value: region.name }
	})
	const roles = formatData(useSelector(selectAllRoles))

	const updateForm = user => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					firstName: user.firstName || '',
					lastName: user.lastName || '',
					email: user.email || '',
					phone1: user.phone1 || '',
					phone2: user.phone2 || '',
					address: user?.residentialAddress?.address || '',
					billing: {
						firstName: user?.billing?.firstName || '',
						lastName: user?.billing?.lastName || '',
						region: user?.billing?.region || '',
						town: user?.billing?.town || '',
						address: user?.billing?.address || '',
						digitalAddress: user?.billing?.digitalAddress || '',
					},
					company: {
						name: user?.company?.name || '',
						phone: user?.company?.phone || '',
						website: user?.company?.website || '',
						region: user?.company?.region || '',
						town: user?.company?.town || '',
						address: user?.company?.address || '',
						digitalAddress: user?.company?.digitalAddress || '',
					},
					shipping: user?.shipping,
					password: '',
					role: user.role._id,
					profileImg: user.profileImg ? [user.profileImg] : [],
					notes: user.notes,
					isActive: user.isActive,
					isApproved: user.isApproved || false,
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
				billing: {
					firstName: '',
					lastName: '',
					region: '',
					town: '',
					address: '',
					digitalAddress: '',
				},
				company: {
					name: '',
					phone: '',
					website: '',
					region: '',
					town: '',
					address: '',
					digitalAddress: '',
				},
				shipping: [],
				profileImg: [],
				password: '',
				role: '',
				notes: '',
				isActive: true,
				isApproved: false,
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

		setFormValue(prev => {
			return { ...prev, password: randPassword }
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
					onCheck={setFormError}
					formValue={formValue}
					model={model}
					disabled={isLoading}
					nestedField
				>
					<Stack
						spacing={30}
						justifyContent='flex-end'
						style={{
							marginBottom: '1.5em',
						}}
					>
						<CustomToggle
							accepter={Toggle}
							name='isActive'
							label='Active'
						/>

						<CustomToggle
							accepter={Toggle}
							name='isApproved'
							label='Approved'
						/>

						<CustomToggle
							accepter={Toggle}
							name='canReceiveEmails'
							label='Emails'
						/>
					</Stack>

					<Panel
						header='General Information'
						bordered
						style={{ marginBottom: '1.8em' }}
					>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='firstName'
									label='First name'
									accepter={Input}
									error={formError.firstName}
								/>
							</Col>

							<Col xs={12}>
								<Field
									name='lastName'
									label='Last name'
									accepter={Input}
									error={formError.lastName}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='email'
									label='Email'
									accepter={Input}
									error={formError.email}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='password'
									label='Password'
									accepter={GeneratePasswordField}
									rule={passwordRule}
									handlePassword={handlePassword}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='phone1'
									label='Primary phone'
									accepter={Input}
									error={formError.phone1}
								/>
							</Col>

							<Col xs={12}>
								<Field
									name='phone2'
									label='Secondary phone'
									accepter={Input}
									error={formError.phone2}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='role'
									label='Role'
									accepter={SelectPicker}
									error={formError.role}
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
									error={formError.description}
									value={formValue.description}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={24}>
								<ImagesUploader
									name='profileImg'
									accepter={Uploader}
									error={formError.profileImg}
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
									error={formError?.company?.name}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='company.phone'
									label='Phone'
									accepter={Input}
									error={formError?.company?.phone}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='company.website'
									label='Website'
									accepter={Input}
									error={formError?.company?.website}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='company.region'
									label='Region'
									accepter={SelectPicker}
									error={formError?.company?.region}
									data={formattedRegions}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='company.town'
									label='Town'
									accepter={Input}
									error={formError?.company?.town}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={12}>
								<Field
									name='company.address'
									label='Address'
									accepter={Input}
									error={formError?.company?.address}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='company.digitalAddress'
									label='Digital address'
									accepter={Input}
									error={formError?.company?.digitalAddress}
								/>
							</Col>
						</Row>
					</Panel>

					<Panel
						header='Billing address'
						bordered
						style={{ marginBottom: '1.8em' }}
					>
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
									accepter={SelectPicker}
									error={formError?.billing?.region}
									data={formattedRegions}
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

					<DeliveryAddresses
						addresses={formValue.shipping}
						setFormValue={setFormValue}
						regions={formattedRegions}
					/>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default UsersDrawer
