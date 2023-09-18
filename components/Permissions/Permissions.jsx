'use client'

import {
	Button,
	Checkbox,
	CheckboxGroup,
	Col,
	List,
	Row,
	SelectPicker,
} from 'rsuite'

import TrashIcon from '@rsuite/icons/Trash'
import { useSelector } from 'react-redux'
import { selectAllResources } from '@/redux/features/resources/resourcesSlice'
import { formatData, getUnassignedResources } from '@/utils/functions'

const Permissions = ({ setFormValue, permissions }) => {
	let resources = formatData(useSelector(selectAllResources))

	const handleSelect = value => {
		setFormValue(prev => {
			return {
				...prev,
				permissions: [
					...permissions,
					{
						resource: value,
						actions: ['create', 'read', 'update', 'delete'],
					},
				],
			}
		})
	}

	const handleDelete = resource => {
		const filtered = permissions.filter(
			permission => permission.resource !== resource
		)
		setFormValue(prev => {
			return { ...prev, permissions: filtered }
		})
	}

	const handleChange = (value, resource) => {
		const newData = permissions.map(permission => {
			if (permission.resource === resource) {
				return {
					...permission,
					actions: value,
				}
			}
			return permission
		})

		setFormValue(prev => {
			return { ...prev, permissions: newData }
		})
	}

	return (
		<>
			<SelectPicker
				label='Permissions'
				onChange={handleSelect}
				data={getUnassignedResources(resources, permissions)}
				block
				cleanable={false}
				value=''
				style={{ marginBottom: '1.4em' }}
			/>

			{permissions.length > 0 ? (
				<List bordered>
					<List.Item>
						<Row style={{ fontSize: 12, opacity: '.8' }}>
							<Col xs={8}>Resource</Col>
							<Col xs={3} style={{ textAlign: 'center' }}>
								Create
							</Col>
							<Col xs={3} style={{ textAlign: 'center' }}>
								Read
							</Col>
							<Col xs={3} style={{ textAlign: 'center' }}>
								Update
							</Col>
							<Col xs={3} style={{ textAlign: 'center' }}>
								Delete
							</Col>
							<Col xs={4} style={{ textAlign: 'center' }}>
								Actions
							</Col>
						</Row>
					</List.Item>

					{permissions.map((permission, i) => (
						<List.Item key={i}>
							<Row style={{ fontSize: 13 }}>
								<Col xs={8}>
									<span style={{ display: 'inline-block', marginTop: 6 }}>
										{permission.resource.name
											? permission.resource.name
											: resources.find(
													resource => resource.value === permission.resource
											  )?.label}
									</span>
								</Col>
								<Col xs={12}>
									<CheckboxGroup
										name='checkboxList'
										value={permission.actions}
										onChange={(val, e) =>
											handleChange(val, permission.resource)
										}
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-around',
										}}
									>
										<Checkbox value={'create'} />
										<Checkbox value={'read'} />
										<Checkbox value={'update'} />
										<Checkbox value={'delete'} />
									</CheckboxGroup>
								</Col>
								<Col xs={4} style={{ textAlign: 'center' }}>
									<Button
										appearance='link'
										color='red'
										style={{ padding: 0, marginTop: 10 }}
										onClick={() => handleDelete(permission.resource)}
									>
										<TrashIcon />
									</Button>
								</Col>
							</Row>
						</List.Item>
					))}
				</List>
			) : (
				<p
					style={{
						fontSize: 12,
						opacity: '.5',
						textAlign: 'center',
						marginTop: '1em',
					}}
				>
					No permissions assigned
				</p>
			)}
		</>
	)
}
export default Permissions
