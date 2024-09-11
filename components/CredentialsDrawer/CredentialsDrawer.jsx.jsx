'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	InputGroup,
	InputPicker,
	Panel,
	Row,
	Schema,
	Stack,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import SendIcon from '@rsuite/icons/Send'

import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createCredential,
	testCredential,
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
	description: StringType(),
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
		description: '',
		isActive: true,
	})
	const [testEmailOpen, setTestEmailOpen] = useState(false)
	const [testEmailRecipient, setTestEmailRecipient] = useState('')

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const credential = useSelector(getDrawerData)
	const servers = useSelector(selectAllServers)

	const formattedServers = servers.map(server => {
		return { label: server.label, value: server._id }
	})

	const handleTestEmail = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (testEmailRecipient && formRef.current.check()) {
			const selectedServer = servers.find(
				server => server._id === formValue.server
			)

			const preparedData = {
				server: {
					host: selectedServer.host,
					secure: selectedServer.isSecure,
					port: selectedServer.port,
				},
				sender: {
					user: formValue.user,
					pass: formValue.password,
					title: formValue.label,
				},
				toEmail: testEmailRecipient,
				subject: 'BS42.NET Test Email',
				message: 'This is a test email from BS42.NET',
			}

			await testCredential(preparedData)
		}
	}

	const updateForm = credential => {
		setTestEmailOpen(false)
		setFormError({})
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					server: credential.server._id,
					label: credential.label,
					user: credential.user,
					password: credential.password,
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
					<Stack
						justifyContent='space-between'
						style={{ marginBottom: '1.4em' }}
					>
						<CustomToggle
							accepter={Toggle}
							name='isActive'
							label='Active'
						/>
						<label
							htmlFor='testEmail'
							style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}
						>
							<Toggle id='testEmail' onChange={setTestEmailOpen} />
							Test
						</label>
					</Stack>

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							rowGap: '1.8em',
						}}
					>
						{testEmailOpen && (
							<Panel bordered>
								<Row>
									<Col xs={24}>
										<span
											style={{
												fontSize: 13,
												color: '#E9EBF0',
												display: 'inline-block',
												marginBottom: 3,
											}}
										>
											Recipient
										</span>
										<InputGroup>
											<Input onChange={setTestEmailRecipient} />
											<InputGroup.Button onClick={handleTestEmail}>
												<SendIcon />
											</InputGroup.Button>
										</InputGroup>
									</Col>
								</Row>
							</Panel>
						)}

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
										name='description'
										label='Description'
										accepter={TextArea}
										error={formError.description}
										value={formValue.description}
									/>
								</Col>
							</Row>
						</Panel>
					</div>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default CredentialsDrawer
