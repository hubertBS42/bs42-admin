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

const { StringType } = Schema.Types

const model = Schema.Model({
	firstName: StringType().isRequired('This field is required.'),
	lastName: StringType().isRequired('This field is required.'),
	address: StringType().isRequired('This field is required.'),
	town: StringType().isRequired('This field is required.'),
	region: StringType().isRequired('This field is required.'),
	digitalAddress: StringType().isRequired('This field is required.'),
})

const AddressDrawer = ({ setCustomer }) => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		firstName: '',
		lastName: '',
		address: '',
		town: '',
		region: '',
		digitalAddress: '',
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isLoading = useSelector(getDrawerLoadingState)
	const addressDetails = useSelector(getDrawerData)

	const updateForm = addressDetails => {
		setFormValue(prev => {
			return {
				...prev,
				firstName: addressDetails?.firstName || '',
				lastName: addressDetails?.lastName || '',
				address: addressDetails?.address || '',
				town: addressDetails?.town || '',
				region: addressDetails?.region || '',
				digitalAddress: addressDetails?.digitalAddress || '',
			}
		})

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (addressDetails.type === 'shipping') {
			setCustomer(prev => {
				return { ...prev, shipping: [{ ...formValue, isActive: true }] }
			})
		} else {
			setCustomer(prev => {
				return { ...prev, billing: formValue }
			})
		}

		dispatch(setDrawerClose())
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(addressDetails)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					Edit{' '}
					{addressDetails?.type &&
						capitalizeFirstLetter(addressDetails.type)}{' '}
					Address
				</Drawer.Title>
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
					>
						Update
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
					<Panel bordered>
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
									name='region'
									label='Region'
									accepter={Input}
									error={formError.region}
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='town'
									label='Town'
									accepter={Input}
									error={formError.town}
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
export default AddressDrawer
