'use client'

import { useEffect, useRef, useState } from 'react'
import {
	Button,
	ButtonToolbar,
	Col,
	Form,
	Grid,
	Input,
	InputPicker,
	Panel,
	Row,
	Schema,
	Stack,
	Toggle,
} from 'rsuite'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useLocation } from '@/hooks/useLocation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StorageMap from '../StorageMap/StorageMap'
import {
	deleteLocation,
	deleteStorage,
	loadStorage,
	updateLocation,
} from '@/redux/features/locations/locationsActions'
import DeleteModal from '../DeleteModal/DeleteModal'
import {
	getLocationsLoadingState,
	setLoading,
} from '@/redux/features/locations/locationsSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
	displayValidationError,
	processFormErrors,
} from '@/utils/functions'

const { StringType, ObjectType } = Schema.Types

const model = Schema.Model({
	name: StringType().isRequired('You must provide a name.'),
	address: ObjectType().shape({
		address: StringType().isRequired('You must provide an address.'),
		town: StringType().isRequired('You must provide a town.'),
		region: StringType().isRequired('You must provide a region.'),
		digitalAddress: StringType(),
	}),
	contact: ObjectType().shape({
		firstName: StringType().isRequired(
			'You must provide a first name.'
		),
		lastName: StringType(),
		phone: StringType().isRequired('You must provide a phone number.'),
		email: StringType().isRequired(
			'You must provide an email address.'
		),
	}),
})

const LocationForm = ({ location }) => {
	const router = useRouter()
	let [regions, towns, handleRegion, clearTowns] = useLocation()

	const isLoading = useSelector(getLocationsLoadingState)
	const dispatch = useDispatch()

	const formRef = useRef()
	// const [isLoading, setIsLoading] = useState(false)
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		name: location?.name || '',
		type: location?.type || '',
		address: {
			address: location?.address?.address || '',
			town: location?.address?.town || '',
			region: location?.address?.region || '',
			digitalAddress: location?.address?.digitalAddress || '',
		},
		contact: {
			firstName: location?.contact?.firstName || '',
			lastName: location?.contact?.lastName || '',
			phone: location?.contact?.phone || '',
			email: location?.contact?.email || '',
		},
		isActive: location?.isActive,
		isDefault: location?.isDefault,
	})

	useEffect(() => {
		loadStorage()

		if (location?.address?.region)
			handleRegion(location?.address?.region)
	}, [])

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}
		dispatch(setLoading(true))
		await updateLocation(location, formValue, router)
		dispatch(setLoading(false))
	}

	const handleDelete = async data => {
		await deleteStorage(data)
	}

	return (
		<>
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
				<Stack justifyContent='flex-end' style={{ marginBottom: 10 }}>
					<ButtonToolbar>
						<Button as={Link} href='/locations' disabled={isLoading}>
							Cancel
						</Button>
						<Button
							appearance='primary'
							onClick={handleSubmit}
							loading={isLoading}
						>
							Update
						</Button>
					</ButtonToolbar>
				</Stack>
				<Grid fluid>
					<Row style={{ marginBottom: 10 }}>
						<Col xs={24}>
							<Panel
								bordered
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
												name='isDefault'
												label='Default'
												readOnly={location?.isDefault}
											/>
										</Stack>
									</Stack>
								}
							>
								<Row>
									<Col xs={24}>
										<Field
											name='name'
											label='Name'
											accepter={Input}
											error={displayValidationError(formError?.name)}
										/>
									</Col>
								</Row>
							</Panel>
						</Col>
					</Row>

					<Row style={{ marginBottom: 10 }}>
						<Col xs={12}>
							<Panel bordered header='Contact information'>
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

								<Row>
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
											name='contact.phone'
											label='Phone number'
											accepter={Input}
											error={displayValidationError(
												formError?.contact?.object?.phone
											)}
										/>
									</Col>
								</Row>
							</Panel>
						</Col>
						<Col xs={12}>
							<Panel bordered header='Address information'>
								<Row style={{ marginBottom: '1.4em' }}>
									<Col xs={12}>
										<Field
											name='address.region'
											label='Region'
											accepter={InputPicker}
											error={displayValidationError(
												formError?.address?.object?.region
											)}
											data={regions}
											onSelect={value => handleRegion(value)}
											onChange={() => {
												setFormValue(prev => {
													return {
														...prev,
														address: { ...formValue.address, town: '' },
													}
												})
											}}
											onClean={() => {
												clearTowns()
											}}
										/>
									</Col>
									<Col xs={12}>
										<Field
											name='address.town'
											label='Town'
											accepter={InputPicker}
											error={displayValidationError(
												formError?.address?.object?.town
											)}
											data={towns}
										/>
									</Col>
								</Row>

								<Row>
									<Col xs={12}>
										<Field
											name='address.address'
											label='Address'
											accepter={Input}
											error={displayValidationError(
												formError?.address?.object?.address
											)}
										/>
									</Col>

									<Col xs={12}>
										<Field
											name='address.digitalAddress'
											label='Digital address'
											accepter={Input}
											error={displayValidationError(
												formError?.address?.object?.digitalAddress
											)}
										/>
									</Col>
								</Row>
							</Panel>
						</Col>
					</Row>

					<Row>
						<Col xs={24}>
							<StorageMap id={location._id} />
						</Col>
					</Row>
				</Grid>
			</Form>
			<DeleteModal handleDelete={handleDelete} />
		</>
	)
}

export default LocationForm
