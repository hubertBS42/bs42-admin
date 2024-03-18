'use client'
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
	Tabs,
	TagInput,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import {
	createTemplate,
	updateTemplate,
} from '@/redux/features/templates/templatesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import TextArea from '../TextArea/TextArea'
import TextEditor from '../TextEditor/TextEditor'
import { selectAllCredentials } from '@/redux/features/credentials/credentialsSlice'

const { StringType, ObjectType, ArrayType } = Schema.Types

const model = Schema.Model({
	label: StringType().isRequired('You must provide a label.'),
	admins: ObjectType().shape({
		sender: StringType(),
		recipients: ArrayType(),
		subject: StringType(),
		message: StringType(),
	}),
	users: ObjectType().shape({
		sender: StringType(),
		subject: StringType(),
		message: StringType(),
	}),
	description: StringType().isRequired(
		'You must provide a description.'
	),
})

const TemplatesDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		label: '',
		admins: { sender: null, recipients: [], subject: '', message: '' },
		users: { sender: null, subject: '', message: '' },
		description: '',
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const template = useSelector(getDrawerData)
	const credentials = useSelector(selectAllCredentials)

	const formattedCredentials = credentials.map(credential => {
		return { label: credential.label, value: credential._id }
	})

	const updateForm = template => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					label: template.label,
					admins: {
						sender: template?.admins?.sender?._id,
						recipients: template?.admins?.recipients,
						subject: template?.admins?.subject,
						message: template?.admins?.message,
					},
					users: {
						sender: template?.users?.sender?._id,
						subject: template?.users?.subject,
						message: template?.users?.message,
					},
					description: template?.description,
					isActive: template?.isActive,
				}
			})
		} else {
			setFormValue({
				label: '',
				admins: {
					sender: null,
					recipients: [],
					subject: '',
					message: '',
				},
				users: { sender: null, subject: '', message: '' },
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
			await updateTemplate(template, formValue)
		} else {
			//add
			await createTemplate(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(template)}
			backdrop='static'
			size='lg'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>{isEditing ? 'Edit' : 'Add'} Template</Drawer.Title>
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
					nestedField
					onChange={setFormValue}
					onCheck={setFormError}
					formValue={formValue}
					model={model}
					disabled={isLoading}
				>
					<CustomToggle accepter={Toggle} name='isActive' label='Active' />

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							rowGap: '1.8em',
						}}
					>
						<Panel bordered header='General Information'>
							<Row style={{ marginBottom: '1.4em' }}>
								<Col xs={24}>
									<Field
										name='label'
										label='Label'
										accepter={Input}
										error={formError.label}
										disabled={isEditing}
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

						<Panel bordered header='Email Configuration'>
							<Tabs defaultActiveKey='1'>
								<Tabs.Tab eventKey='1' title='Administrators'>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='admins.sender'
												label='Sender'
												accepter={InputPicker}
												error={formError?.admins?.sender}
												data={formattedCredentials}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='admins.recipients'
												label='Email recipients'
												accepter={TagInput}
												error={formError?.admins?.recipients}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='admins.subject'
												label='Email subject'
												accepter={Input}
												error={formError?.admins?.subject}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='admins.message'
												label='Email message'
												accepter={TextEditor}
												error={formError?.admins?.message}
												value={template ? template?.admins?.message : ''}
											/>
										</Col>
									</Row>
								</Tabs.Tab>
								<Tabs.Tab eventKey='2' title='Users'>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='users.sender'
												label='Sender'
												accepter={InputPicker}
												error={formError?.users?.sender}
												data={formattedCredentials}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='users.subject'
												label='Email subject'
												accepter={Input}
												error={formError?.users?.subject}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='users.message'
												label='Email message'
												accepter={TextEditor}
												error={formError?.users?.message}
												value={template ? template?.users?.message : ''}
											/>
										</Col>
									</Row>
								</Tabs.Tab>
							</Tabs>
						</Panel>
					</div>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default TemplatesDrawer
