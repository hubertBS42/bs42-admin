import {
	Checkbox,
	Col,
	IconButton,
	Input,
	InputPicker,
	Panel,
	Row,
	Stack,
	Text,
} from 'rsuite'
import TrashIcon from '@rsuite/icons/Trash'
import { useLocation } from '@/hooks/useLocation'
import { useEffect } from 'react'

const ShippingAddressPanel = ({
	address,
	setFormValue,
	formValue,
	setDisabled,
	errors,
	i,
}) => {
	const [regions, towns, handleRegion, clearTowns] = useLocation()

	useEffect(() => {
		if (address?.region) handleRegion(address?.region)
	}, [])

	const errorsObject = errors.length > 0 ? errors[i]?.object : null

	const handlePrimaryAddressChange = index => {
		const newData = formValue.shipping.map(address => {
			if (address.index === index) {
				return {
					...address,
					isPrimary: true,
				}
			}
			return {
				...address,
				isPrimary: false,
			}
		})

		setFormValue(prev => {
			return { ...prev, shipping: newData }
		})
	}

	const handleDelete = index => {
		const position = formValue.shipping.findIndex(
			address => address.index === index
		)
		if (position === formValue.shipping.length - 1) setDisabled(false)

		const filtered = formValue.shipping.filter(
			address => address.index !== index
		)
		setFormValue(prev => {
			return { ...prev, shipping: filtered }
		})
	}

	const handleChange = (value, index, name) => {
		const newData = formValue.shipping.map(address => {
			if (address.index === index) {
				return {
					...address,
					[name]: value,
				}
			}
			return address
		})

		setFormValue(prev => {
			return { ...prev, shipping: newData }
		})
	}

	return (
		<Panel key={address.index} bordered>
			<Row style={{ marginBottom: '1.2em' }}>
				<Col xs={12}>
					<label style={{ fontSize: 13 }}>First name</label>
					<Input
						name='firstName'
						onChange={(val, e) =>
							handleChange(val, address.index, 'firstName')
						}
						defaultValue={address.firstName}
						style={{ marginTop: '.3em' }}
					/>
					{errorsObject && errorsObject.firstName.hasError && (
						<Text color='red' size='sm' style={{ marginTop: 2 }}>
							{errorsObject.firstName.errorMessage}
						</Text>
					)}
				</Col>
				<Col xs={12}>
					<label style={{ fontSize: 13 }}>Last name</label>
					<Input
						name='lastName'
						onChange={(val, e) =>
							handleChange(val, address.index, 'lastName')
						}
						defaultValue={address.lastName}
						style={{ marginTop: '.3em' }}
					/>
					{errorsObject && errorsObject.lastName.hasError && (
						<Text color='red' size='sm' style={{ marginTop: 2 }}>
							{errorsObject.lastName.errorMessage}
						</Text>
					)}
				</Col>
			</Row>

			<Row style={{ marginBottom: '1.2em' }}>
				<Col xs={24}>
					<label style={{ fontSize: 13 }}>Phone</label>
					<Input
						name='phone'
						onChange={(val, e) => handleChange(val, address.index, 'phone')}
						defaultValue={address.phone}
						style={{ marginTop: '.3em' }}
					/>
					{errorsObject && errorsObject.phone.hasError && (
						<Text color='red' size='sm' style={{ marginTop: 2 }}>
							{errorsObject.phone.errorMessage}
						</Text>
					)}
				</Col>
			</Row>

			<Row style={{ marginBottom: '1.2em' }}>
				<Col xs={12}>
					<label style={{ fontSize: 13 }}>Region</label>
					<InputPicker
						name='region'
						onChange={(val, e) => {
							// handleChange(val, address.index, 'region')
							setFormValue(prev => {
								return {
									...prev,
									billing: { ...formValue.shipping, town: '' },
								}
							})
						}}
						value={address.region}
						data={regions}
						style={{ marginTop: '.3em' }}
						onSelect={value => {
							handleChange(value, address.index, 'region')
							handleRegion(value)
						}}
						onClean={() => {
							handleChange('', address.index, 'region')
							clearTowns()
						}}
						block
					/>
					{errorsObject && errorsObject.region.hasError && (
						<Text color='red' size='sm' style={{ marginTop: 2 }}>
							{errorsObject.region.errorMessage}
						</Text>
					)}
				</Col>
				<Col xs={12}>
					<label style={{ fontSize: 13 }}>Town</label>
					<InputPicker
						name='town'
						onChange={(val, e) => handleChange(val, address.index, 'town')}
						value={address.town}
						data={towns}
						style={{ marginTop: '.3em' }}
						block
					/>
					{errorsObject && errorsObject.town.hasError && (
						<Text color='red' size='sm' style={{ marginTop: 2 }}>
							{errorsObject.town.errorMessage}
						</Text>
					)}
				</Col>
			</Row>

			<Row style={{ marginBottom: '1.2em' }}>
				<Col xs={24}>
					<label style={{ fontSize: 13 }}>Address</label>
					<Input
						name='address'
						onChange={(val, e) =>
							handleChange(val, address.index, 'address')
						}
						defaultValue={address.address}
						style={{ marginTop: '.3em' }}
					/>
					{errorsObject && errorsObject.address.hasError && (
						<Text color='red' size='sm' style={{ marginTop: 2 }}>
							{errorsObject.address.errorMessage}
						</Text>
					)}
				</Col>
			</Row>

			<Stack justifyContent='space-between'>
				{!address.isPrimary && formValue.shipping.length > 1 && (
					<Checkbox
						onChange={() => handlePrimaryAddressChange(address.index)}
						checked={address.isPrimary}
					>
						Primary address
					</Checkbox>
				)}
				{!address.isPrimary && (
					<IconButton
						icon={<TrashIcon />}
						appearance='link'
						color='red'
						circle
						onClick={() => handleDelete(address.index)}
					/>
				)}
			</Stack>
		</Panel>
	)
}
export default ShippingAddressPanel
