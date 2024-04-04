'use client'

import {
	Checkbox,
	Col,
	IconButton,
	Input,
	Panel,
	Row,
	SelectPicker,
	Stack,
} from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import { nanoid } from '@reduxjs/toolkit'
import { useState } from 'react'

const DeliveryAddresses = ({ addresses, setFormValue, regions }) => {
	const [disabled, setDisabled] = useState(false)
	const handleAdd = () => {
		setDisabled(true)
		const index = nanoid()
		setFormValue(prev => {
			return {
				...prev,
				shipping: [
					{
						index,
						firstName: '',
						lastName: '',
						address: '',
						digitalAddress: '',
						town: '',
						region: '',
						isPrimary: false,
					},
					...addresses,
				],
			}
		})
	}

	const handleDelete = index => {
		const position = addresses.findIndex(
			address => address.index === index
		)
		if (position === 0) setDisabled(false)

		const filtered = addresses.filter(
			address => address.index !== index
		)
		setFormValue(prev => {
			return { ...prev, shipping: filtered }
		})
	}

	const handleChange = (value, index, name) => {
		const newData = addresses.map(address => {
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
		<Panel
			header={
				<Stack justifyContent='space-between'>
					<span>Shipping Addresses</span>
					<IconButton
						icon={<PlusIcon />}
						circle
						size='xs'
						appearance='primary'
						onClick={handleAdd}
						disabled={disabled}
					/>
				</Stack>
			}
			bordered
		>
			{addresses.length > 0 ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						rowGap: '1.5em',
					}}
				>
					{addresses.map(address => (
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
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={12}>
									<label style={{ fontSize: 13 }}>Region</label>
									<SelectPicker
										name='region'
										onChange={(val, e) =>
											handleChange(val, address.index, 'region')
										}
										value={address.region}
										data={regions}
										block
										style={{ marginTop: '.3em' }}
									/>
								</Col>
								<Col xs={12}>
									<label style={{ fontSize: 13 }}>Town</label>
									<Input
										name='town'
										onChange={(val, e) =>
											handleChange(val, address.index, 'town')
										}
										defaultValue={address.town}
										style={{ marginTop: '.3em' }}
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.2em' }}>
								<Col xs={12}>
									<label style={{ fontSize: 13 }}>Address</label>
									<Input
										name='address'
										onChange={(val, e) =>
											handleChange(val, address.index, 'address')
										}
										defaultValue={address.address}
										style={{ marginTop: '.3em' }}
									/>
								</Col>
								<Col xs={12}>
									<label style={{ fontSize: 13 }}>Digital address</label>
									<Input
										name='digitalAddress'
										onChange={(val, e) =>
											handleChange(val, address.index, 'digitalAddress')
										}
										defaultValue={address.digitalAddress}
										style={{ marginTop: '.3em' }}
									/>
								</Col>
							</Row>

							<Stack justifyContent='space-between'>
								<Checkbox
									name='isPrimary'
									onChange={(val, checked) =>
										handleChange(checked, address.index, 'isPrimary')
									}
								>
									Primary address
								</Checkbox>
								<IconButton
									icon={<TrashIcon />}
									appearance='link'
									color='red'
									circle
									onClick={() => handleDelete(address.index)}
								/>
							</Stack>
						</Panel>
					))}
				</div>
			) : (
				<p
					style={{
						fontSize: 12,
						opacity: '.5',
						textAlign: 'center',
						marginTop: '1em',
						marginBottom: '2em',
					}}
				>
					There are no shipping addresses for this user.
				</p>
			)}
		</Panel>
	)
}
export default DeliveryAddresses
