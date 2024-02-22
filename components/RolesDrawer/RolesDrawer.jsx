import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Grid,
	Input,
	Panel,
	Row,
	Schema,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'

import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createRole,
	updateRole,
} from '@/redux/features/roles/rolesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import TextArea from '../TextArea/TextArea'
import Permissions from '../Permissions/Permissions'

const { StringType } = Schema.Types

const model = Schema.Model({
	title: StringType().isRequired('You must provide a title.'),
	description: StringType(),
})

const RolesDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		title: '',
		permissions: [],
		description: '',
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const role = useSelector(getDrawerData)

	const updateForm = role => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					title: role.title,
					permissions: role.permissions,
					description: role.description,
					isActive: role.isActive,
				}
			})
		} else {
			setFormValue({
				title: '',
				permissions: [],
				description: '',
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
			await updateRole(role, formValue)
		} else {
			//create
			await createRole(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(role)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Role</Drawer.Title>
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
						<Grid fluid>
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='title'
										label='Title'
										accepter={Input}
										error={formError.title}
										autoFocus
									/>
								</Col>
							</Row>

							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='description'
										label='Description'
										accepter={TextArea}
										error={formError.description}
										value={formValue.description}
									/>
								</Col>
							</Row>

							<Row>
								<Col xs={24}>
									<Permissions
										setFormValue={setFormValue}
										permissions={formValue.permissions}
									/>
								</Col>
							</Row>
						</Grid>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default RolesDrawer
