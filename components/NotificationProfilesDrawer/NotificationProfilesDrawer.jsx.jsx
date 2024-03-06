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
	createNotificationProfile,
	updateNotificationProfile,
} from '@/redux/features/notificationProfiles/notificationProfilesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	getEditState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import TextArea from '../TextArea/TextArea'
import { selectAllNotificationProfiles } from '@/redux/features/notificationProfiles/notificationProfilesSlice'
import TextEditor from '../TextEditor/TextEditor'
import { selectAllCredentials } from '@/redux/features/credentials/credentialsSlice'

const { StringType, ObjectType, ArrayType } = Schema.Types

const model = Schema.Model({
	label: StringType().isRequired('You must provide a label.'),
	admins: ObjectType().shape({
		sender: StringType().isRequired(
			'You must choose a sender credential.'
		),
		recipients: ArrayType().minLength(
			1,
			'You must provide at least one email address as a recipient.'
		),
		title: StringType().isRequired(
			'You must provide a title for the email.'
		),
		body: StringType().isRequired(
			'You must provide the body for the email.'
		),
	}),
	users: ObjectType().shape({
		sender: StringType().isRequired(
			'You must choose a sender credential.'
		),
		recipients: ArrayType().minLength(
			1,
			'You must provide at least one email address as a recipient.'
		),
		title: StringType().isRequired(
			'You must provide a title for the email.'
		),
		body: StringType().isRequired(
			'You must provide the body for the email.'
		),
	}),
	description: StringType().isRequired(
		'You must provide a description.'
	),
})

const NotificationProfilesDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		label: '',
		admins: { sender: '', recipients: [], title: '', body: '' },
		users: { sender: '', recipients: [], title: '', body: '' },
		description: '',
		isActive: true,
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isEditing = useSelector(getEditState)
	const isLoading = useSelector(getDrawerLoadingState)
	const profile = useSelector(getDrawerData)
	const profiles = useSelector(selectAllNotificationProfiles)
	const credentials = useSelector(selectAllCredentials)

	const formattedCredentials = credentials.map(credential => {
		return { label: credential.label, value: credential._id }
	})

	const updateForm = profile => {
		if (isEditing) {
			setFormValue(prev => {
				return {
					...prev,
					label: profile.label,
					admins: {
						sender: profile.admins.sender._id,
						recipients: profile.admins.recipients,
						title: profile.admins.title,
						body: profile.admins.body,
					},
					users: {
						sender: profile.users.sender._id,
						recipients: profile.users.recipients,
						title: profile.users.title,
						body: profile.users.body,
					},
					description: profile.description,
					isActive: profile.isActive,
				}
			})
		} else {
			setFormValue({
				label: '',
				admins: { sender: '', recipients: [], title: '', body: '' },
				users: { sender: '', recipients: [], title: '', body: '' },
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
			await updateNotificationProfile(profile, formValue)
		} else {
			//add
			await createNotificationProfile(formValue)
		}
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(profile)}
			backdrop='static'
			size='lg'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>
					{isEditing ? 'Edit' : 'Add'} Notification Profile
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
												name='admins.title'
												label='Email title'
												accepter={Input}
												error={formError?.admins?.title}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='admins.body'
												label='Email body'
												accepter={TextEditor}
												error={formError?.admins?.body}
												value={profile ? profile.admins.body : ''}
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
												name='users.recipients'
												label='Email recipients'
												accepter={TagInput}
												error={formError?.users?.recipients}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='users.title'
												label='Email title'
												accepter={Input}
												error={formError?.users?.title}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 25 }}>
										<Col xs={24}>
											<Field
												name='users.body'
												label='Email body'
												accepter={TextEditor}
												error={formError?.users?.email}
												value={profile ? profile.users.body : ''}
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
export default NotificationProfilesDrawer
