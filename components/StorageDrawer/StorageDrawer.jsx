'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	InputNumber,
	Panel,
	Row,
	Schema,
	SelectPicker,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createStorage,
	updateStorage,
} from '@/redux/features/locations/locationsActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import {
	findLocationDescendants,
	getDisabledItems,
} from '@/utils/functions'
import { selectAllLocations } from '@/redux/features/locations/locationsSlice'
import TextArea from '../TextArea/TextArea'

const { StringType, NumberType } = Schema.Types

const StorageDrawer = ({ id }) => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		name: '',
		type: 'section',
		description: '',
		level: null,
		length: null,
		parent: id,
		capacity: null,
	})

	const model = Schema.Model({
		name: StringType().isRequired('You must provide a name.'),
		type: StringType().isRequired('You must specify a type.'),
		parent:
			formValue?.type !== 'section'
				? StringType().isRequired('This field is required.')
				: StringType(),
		description: StringType(),
		level:
			formValue?.type === 'shelf'
				? NumberType().isRequired('This field is required.')
				: NumberType(),
		length: NumberType(),
		capacity: NumberType(),
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const location = useSelector(getDrawerData)
	const locations = useSelector(selectAllLocations)
	const [parents, setParents] = useState([])
	const [parentLabel, setParentLabel] = useState('')
	const [disabledStorage, setDisabledStorage] = useState([])

	const descendants = findLocationDescendants(locations, id)

	const updateForm = location => {
		setFormError({})
		if (isEditing) {
			const data = getDisabledItems(locations, location.id)
			setDisabledStorage(data)

			if (location.type === 'aisle') {
				const data = descendants
					.filter(location => location.type === 'section')
					.map(location => ({ label: location.name, value: location._id }))

				setParents(data)
				setParentLabel('Section')
			}

			if (location.type === 'shelf') {
				const data = descendants
					.filter(location => location.type === 'aisle')
					.map(location => ({ label: location.name, value: location._id }))

				setParents(data)
				setParentLabel('Aisle')
			}

			if (location.type === 'slot') {
				const data = descendants
					.filter(location => location.type === 'shelf')
					.map(location => ({ label: location.name, value: location._id }))

				setParents(data)
				setParentLabel('Shelf')
			}

			setFormValue(prev => {
				return {
					...prev,
					name: location?.name || '',
					type: location?.type || '',
					description: location?.description || '',
					level: location?.level || null,
					length: location?.length || null,
					parent: location?.parent._id || null,
					capacity: location?.capacity || null,
				}
			})
		} else {
			// setDisabledLocations([])
			setFormValue({
				name: '',
				type: 'section',
				description: '',
				level: null,
				length: null,
				parent: id,
				capacity: null,
			})
		}

		return
	}

	const handleChange = type => {
		let preparedData = {
			name: isEditing ? location.name : '',
			description: isEditing ? location.description : '',
			type,
			level: null,
			length: null,
			capacity: null,
			parent: null,
		}

		if (type === 'section') {
			setParents([])
			setParentLabel('')
			preparedData = { ...preparedData, parent: id }
		}

		if (type === 'aisle') {
			const data = descendants
				.filter(location => location.type === 'section')
				.map(location => ({ label: location.name, value: location._id }))

			setParents(data)
			setParentLabel('Section')
		}

		if (type === 'shelf') {
			const data = descendants
				.filter(location => location.type === 'aisle')
				.map(location => ({ label: location.name, value: location._id }))

			setParents(data)
			setParentLabel('Aisle')
		}

		if (type === 'slot') {
			const data = descendants
				.filter(location => location.type === 'shelf')
				.map(location => ({ label: location.name, value: location._id }))

			setParents(data)
			setParentLabel('Shelf')
		}

		setFormValue(preparedData)

		// if (type === 'section') {
		// 	preparedData = {...prepatedData, }
		// }
		// if (type === 'section') {
		// 	setParents([])
		// 	setParentLabel('')
		// 	setFormValue({
		// 		name: location.name,
		// 		type,
		// 		description: '',
		// 		level: null,
		// 		length: null,
		// 		parent: id,
		// 		capacity: null,
		// 	})
		// } else {
		// 	setFormValue({
		// 		name: location.name,
		// 		type,
		// 		description: '',
		// 		level: null,
		// 		length: null,
		// 		parent: null,
		// 		capacity: null,
		// 	})
		// }
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (isEditing) {
			//update
			await updateStorage(location, formValue)
		} else {
			//create
			await createStorage(formValue)
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
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Storage</Drawer.Title>
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
					<Panel bordered>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='type'
									label='Type'
									accepter={SelectPicker}
									error={formError.type}
									searchable={false}
									cleanable={false}
									data={[
										{ label: 'Section', value: 'section' },
										{ label: 'Aisle', value: 'aisle' },
										{ label: 'Shelf', value: 'shelf' },
										{ label: 'Slot', value: 'slot' },
									]}
									onChange={handleChange}
								/>
							</Col>
						</Row>

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

						{['aisle', 'shelf', 'slot'].includes(formValue.type) && (
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='parent'
										label={parentLabel}
										accepter={SelectPicker}
										error={formError.parent}
										searchable={false}
										cleanable={false}
										data={parents}
										disabledItemValues={disabledStorage}
									/>
								</Col>
							</Row>
						)}

						{formValue.type === 'shelf' && (
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='level'
										label='Level'
										accepter={InputNumber}
										error={formError.level}
										min={1}
									/>
								</Col>
							</Row>
						)}

						{['shelf', 'slot'].includes(formValue.type) && (
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='capacity'
										label='Capacity'
										accepter={InputNumber}
										error={formError.capacity}
										min={1}
									/>
								</Col>
							</Row>
						)}

						{formValue.type === 'aisle' && (
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='length'
										label='Length'
										accepter={InputNumber}
										error={formError.length}
										min={1}
									/>
								</Col>
							</Row>
						)}

						<Row>
							<Col xs={24}>
								<Field
									name='description'
									label='Description'
									accepter={TextArea}
									error={formError.description}
								/>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default StorageDrawer
