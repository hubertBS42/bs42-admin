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
	Toggle,
	Uploader,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createLocation,
	updateLocation,
} from '@/redux/features/locations/locationsActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import { useLocation } from '@/hooks/useLocation'

const { StringType } = Schema.Types

const model = Schema.Model({
	name: StringType().isRequired('You must provide a name.'),
	phone: StringType().isRequired('You must provide a phone number.'),
	address: StringType().isRequired('You must provide an address.'),
	town: StringType().isRequired('You must provide town.'),
	region: StringType().isRequired('You must provide a region.'),
	digitalAddress: StringType(),
})

const LocationsDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		name: '',
		phone: '',
		address: '',
		town: '',
		region: '',
		digitalAddress: '',
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const location = useSelector(getDrawerData)

	const [regions, towns, handleRegion, clearTowns] = useLocation()

	const updateForm = location => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					name: location.name,
					phone: location.phone,
					address: location.address,
					town: location.town,
					region: location.region,
					digitalAddress: location.digitalAddress,
					isActive: location.isActive,
				}
			})
		} else {
			setFormValue({
				name: '',
				phone: '',
				address: '',
				town: '',
				region: '',
				digitalAddress: '',
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
			await updateLocation(location, formValue)
		} else {
			//create
			await createLocation(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(location)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Location</Drawer.Title>
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
					<CustomToggle accepter={Toggle} name='isActive' label='Active' />

					<Panel bordered>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='name'
									label='Name'
									accepter={Input}
									error={formError.name}
									autoFocus
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='phone'
									label='Phone'
									accepter={Input}
									error={formError.phone}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='address'
									label='Address'
									accepter={Input}
									error={formError.address}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='region'
									label='Region'
									accepter={InputPicker}
									error={formError.region}
									data={regions}
									onSelect={value => handleRegion(value)}
									onChange={() => {
										setFormValue(prev => {
											return {
												...prev,
												town: '',
											}
										})
									}}
									onClean={() => {
										clearTowns()
									}}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='town'
									label='Town'
									accepter={InputPicker}
									error={formError.town}
									data={towns}
									disabled={towns.length === 0}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='digitalAddress'
									label='Digital address'
									accepter={Input}
									error={formError.digitalAddress}
								/>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default LocationsDrawer
