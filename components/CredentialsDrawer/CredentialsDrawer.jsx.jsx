'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	InputNumber,
	InputPicker,
	Panel,
	Row,
	Schema,
	Stack,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createCredential,
	updateCredential,
} from '@/redux/features/credentials/credentialsActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import TextArea from '../TextArea/TextArea'
import { selectAllServers } from '@/redux/features/servers/serversSlice'

const { StringType } = Schema.Types

const model = Schema.Model({
	server: StringType().isRequired(
		'You must choose an outgoing server.'
	),
	label: StringType().isRequired('You must provide a label.'),
	user: StringType()
		.isEmail('You must provide a valid email address.')
		.isRequired('You must provide an email address.'),
	password: StringType().isRequired('You must provide a password.'),
	fromEmail: StringType()
		.isRequired('You must provide a from address.')
		.isEmail('You must provide a valid email address.'),
	description: StringType().isRequired(
		'You must provide a description.'
	),
})

const CredentialsDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		server: '',
		label: '',
		user: '',
		password: '',
		fromEmail: '',
		description: '',
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const credential = useSelector(getDrawerData)
	const servers = useSelector(selectAllServers)

	const formattedServers = servers.map(server => {
		return { label: server.label, value: server._id }
	})

	const updateForm = credential => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					server: credential.server._id,
					label: credential.label,
					user: credential.user,
					password: credential.password,
					fromEmail: credential.fromEmail,
					description: credential.description,
					isActive: credential.isActive,
				}
			})
		} else {
			setFormValue({
				server: '',
				label: '',
				user: '',
				password: '',
				fromEmail: '',
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
			await updateCredential(credential, formValue)
		} else {
			//add
			await createCredential(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(credential)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					{isEditing ? 'Edit' : 'Add'} Credential
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
						disabled={isLoading}
						loading={isLoading}
					>
						{isEditing ? 'Update' : 'Add'}
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

					<Panel bordered header='Credential Details'>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='server'
									label='Outgoing server'
									accepter={InputPicker}
									error={formError.server}
									data={formattedServers}
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='label'
									label='Label'
									accepter={Input}
									error={formError.label}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='user'
									label='User'
									accepter={Input}
									error={formError.user}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='password'
									label='Password'
									accepter={Input}
									error={formError.password}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='fromEmail'
									label='From email'
									accepter={Input}
									error={formError.fromEmail}
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
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default CredentialsDrawer
