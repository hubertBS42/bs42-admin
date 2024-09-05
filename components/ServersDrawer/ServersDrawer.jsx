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
	Stack,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createServer,
	updateServer,
} from '@/redux/features/servers/serversActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import TextArea from '../TextArea/TextArea'

const { StringType, NumberType } = Schema.Types

const model = Schema.Model({
	label: StringType().isRequired('You must provide a label.'),
	host: StringType().isRequired(
		"You must provide the outgoing server's host name."
	),
	port: NumberType().isRequired(
		"You must provide the outgoing server's port number."
	),
	description: StringType().isRequired(
		'You must provide a description.'
	),
})

const ServersDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		label: '',
		host: '',
		port: '',
		isSecure: true,
		credentials: [],
		description: '',
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const server = useSelector(getDrawerData)

	const updateForm = server => {
		setFormError({})
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					label: server.label,
					host: server.host,
					port: server.port,
					isSecure: server.isSecure,
					credentials: server.credentials ? server.credentials : [],
					description: server.description,
					isActive: server.isActive,
				}
			})
		} else {
			setFormValue({
				label: '',
				host: '',
				port: '',
				isSecure: true,
				credentials: [],
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
			await updateServer(server, formValue)
		} else {
			//add
			await createServer(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(server)}
			backdrop='static'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					{isEditing ? 'Edit' : 'Add'} Outgoing Server
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

					<Panel
						bordered
						header={
							<Stack justifyContent='space-between'>
								<span>Server Details</span>
								<CustomToggle
									accepter={Toggle}
									name='isSecure'
									label='Secure login'
								/>
							</Stack>
						}
					>
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
									name='host'
									label='Host name'
									accepter={Input}
									error={formError.host}
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='port'
									label='Port'
									accepter={InputNumber}
									error={formError.port}
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
export default ServersDrawer
