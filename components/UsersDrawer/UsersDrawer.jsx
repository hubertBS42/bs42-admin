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

const { StringType, ArrayType } = Schema.Types

const model = Schema.Model({
	firstName: StringType().isRequired(
		"You must provide user's first name."
	),
	lastName: StringType(),
	email: StringType().isRequired('You must provide an email address.'),
	phone1: StringType(),
	phone2: StringType(),
	rStreeName: StringType(),
	rDigitalAddress: StringType(),
	rArea: StringType(),
	rRegion: StringType(),
	cName: StringType(),
	cPhone: StringType(),
	website: StringType(),
	cStreetName: StringType(),
	cDigitalAddress: StringType(),
	cArea: StringType(),
	cRegion: StringType(),
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
		rAddress: '',
		rDigitalAddress: '',
		rTown: '',
		rRegion: '',
		cName: '',
		cPhone: '',
		website: '',
		cAddress: '',
		cDigitalAddress: '',
		cTown: '',
		cRegion: '',
		shippingAddresses: [],
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
					rDigitalAddress: user?.residentialAddress?.digitalAddress || '',
					rTown: user?.residentialAddress?.town || '',
					rRegion: user?.residentialAddress?.region || '',
					cName: user?.company?.name || '',
					cPhone: user?.company?.phone || '',
					website: user?.company?.website || '',
					cAddress: user?.company?.address.address || '',
					cDigitalAddress: user?.company?.address.digitalAddress || '',
					cTown: user?.company?.address.town || '',
					cRegion: user?.company?.address.region || '',
					shippingAddresses: user?.shippingAddresses,
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
				rAddress: '',
				rDigitalAddress: '',
				rTown: '',
				rRegion: '',
				shippingAddresses: [],
				cName: '',
				cPhone: '',
				website: '',
				cAddress: '',
				cDigitalAddress: '',
				cTown: '',
				cRegion: '',
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
							<Col xs={24}>
								<Field
									name='email'
									label='Email'
									accepter={Input}
									error={formError.email}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='phone1'
									label='Primary phone number'
									accepter={Input}
									error={formError.phone1}
								/>
							</Col>

							<Col xs={12}>
								<Field
									name='phone2'
									label='Secondary phone number'
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
									error={formError.rRegion}
									data={roles}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
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
							<Col xs={23}>
								<Field
									name='cName'
									label='Name'
									accepter={Input}
									error={formError.cName}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='cPhone'
									label='Phone Number'
									accepter={Input}
									error={formError.cPhone}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='website'
									label='Website'
									accepter={Input}
									error={formError.website}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='cAddress'
									label='Address'
									accepter={Input}
									error={formError.cAddress}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='cDigitalAddress'
									label='Digital Address'
									accepter={Input}
									error={formError.cDigitalAddress}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='cTown'
									label='Town'
									accepter={Input}
									error={formError.cTown}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='cRegion'
									label='Region'
									accepter={SelectPicker}
									error={formError.cRegion}
									data={formattedRegions}
								/>
							</Col>
						</Row>
					</Panel>

					<Panel
						header='Residential Address'
						bordered
						style={{ marginBottom: '1.8em' }}
					>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='rAddress'
									label='Address'
									accepter={Input}
									error={formError.rAddress}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='rDigitalAddress'
									label='Digital address'
									accepter={Input}
									error={formError.rDigitalAddress}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='rTown'
									label='Town'
									accepter={Input}
									error={formError.rTown}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='rRegion'
									label='Region'
									accepter={SelectPicker}
									error={formError.rRegion}
									data={formattedRegions}
								/>
							</Col>
						</Row>
					</Panel>

					<DeliveryAddresses
						addresses={formValue.shippingAddresses}
						setFormValue={setFormValue}
						regions={formattedRegions}
					/>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default UsersDrawer
