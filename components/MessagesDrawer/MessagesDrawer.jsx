'use client'
import { useRef, useState } from 'react'
import {
	Button,
	Col,
	DateInput,
	Drawer,
	Form,
	Input,
	InputGroup,
	InputPicker,
	Panel,
	Row,
	Schema,
	SelectPicker,
	Stack,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'

import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import { useDispatch, useSelector } from 'react-redux'

import { updateMessage } from '@/redux/features/messages/messagesActions'

import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'

import TextArea from '../TextArea/TextArea'
import {
	formatData,
	formatDate,
	genFullName,
} from '@/utils/functions'
import { selectAllUsers } from '@/redux/features/users/usersSlice'

const { StringType, ObjectType } = Schema.Types

const model = Schema.Model({
	status: StringType().isRequired(
		'You must specify the current status of this message.'
	),
})

const MessagesDrawer = () => {
	const dispatch = useDispatch()
	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		subject: '',
		body: '',
		sender: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			companyName: '',
		},
		acknowledgement: {
			date: null,
			user: null,
		},
		status: 'pending',
		completedOn: null,
		receivedOn: null,
		comments: [],
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isLoading = useSelector(getDrawerLoadingState)
	const message = useSelector(getDrawerData)
	let users = useSelector(selectAllUsers)

	const sortedUsers = [...users].sort((a, b) => {
		const firstNameA = a.firstName.toLowerCase()
		const firstNameB = b.firstName.toLowerCase()

		// Compare first names
		if (firstNameA < firstNameB) {
			return -1 // a should come before b in the sorted order
		}
		if (firstNameA > firstNameB) {
			return 1 // a should come after b in the sorted order
		}
		return 0 // Names are equal
	})

	let adminUsers = sortedUsers
		.filter(user => user.role.title !== 'User')
		.map(user => {
			const name =
				user.lastName === ''
					? user.firstName
					: user.firstName + ' ' + user.lastName
			return {
				name,
				_id: user._id,
			}
		})

	adminUsers = formatData(adminUsers)

	const updateForm = message => {
		setFormValue(prev => {
			return {
				...prev,
				subject: message?.subject,
				body: message?.body,
				sender: {
					firstName: message?.sender?.firstName,
					lastName: message?.sender?.lastName,
					email: message?.sender?.email,
					phone: message?.sender?.phone,
					companyName: message?.sender?.companyName || '',
				},
				acknowledgement: {
					date: message?.acknowledgement?.date
						? new Date(message?.acknowledgement?.date)
						: null,
					user: message?.acknowledgement?.user?._id || null,
				},
				status: message?.status,
				completedOn: message.completedOn
					? new Date(message.completedOn)
					: null,
				receivedOn: new Date(message.createdAt),
				comments: message?.comments || [],
			}
		})

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		const { receivedOn, sender, body, subject, ...rest } = formValue

		await updateMessage(message, rest)
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(message)}
			backdrop='static'
			size='md'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>Manage Message</Drawer.Title>
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
						Update
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
					nestedField
				>
					<Panel header='Status' bordered style={{ marginBottom: '1em' }}>
						<Row style={{ marginBottom: '1em' }}>
							<Col xs={24}>
								<Field
									name='status'
									label='Status'
									accepter={SelectPicker}
									data={[
										{ label: 'Pending', value: 'pending' },
										{ label: 'Acknowledged', value: 'acknowledged' },
										{ label: 'Completed', value: 'completed' },
									]}
									disabledItemValues={['pending']}
									disabled={message?.status === 'completed'}
									cleanable={false}
									searchable={false}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={12}>
								<Field
									name='receivedOn'
									label='Received on'
									accepter={DateInput}
									readOnly
									format='yyyy-MM-dd h:mm aa'
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='completedOn'
									label='Completed on'
									accepter={DateInput}
									readOnly
									format='yyyy-MM-dd h:mm aa'
									placeholder='Pending...'
								/>
							</Col>
						</Row>
					</Panel>

					<Panel
						header='Acknowledgement'
						bordered
						style={{ marginBottom: '1em' }}
					>
						<Row>
							<Col xs={12}>
								<Field
									name='acknowledgement.date'
									label='Acknowledged at'
									accepter={DateInput}
									readOnly
									format='yyyy-MM-dd h:mm aa'
									placeholder='Pending...'
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='acknowledgement.user'
									label='Acknowledged by'
									accepter={InputPicker}
									data={adminUsers}
									readOnly
									placeholder='Pending...'
								/>
							</Col>
						</Row>
					</Panel>

					<Panel header='Message' bordered style={{ marginBottom: '1em' }}>
						<Row style={{ marginBottom: '1em' }}>
							<Col xs={24}>
								<Field
									name='subject'
									label='Subject'
									accepter={Input}
									readOnly
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1em' }}>
							<Col xs={24}>
								<Field
									name='body'
									label='Body'
									accepter={TextArea}
									rows={4}
									readOnly
								/>
							</Col>
						</Row>
					</Panel>

					<Panel header='Sender' bordered style={{ marginBottom: '1em' }}>
						<Row style={{ marginBottom: '1em' }}>
							<Col xs={12}>
								<Field
									name='sender.firstName'
									label='First name'
									accepter={Input}
									readOnly
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='sender.lastName'
									label='Last name'
									accepter={Input}
									readOnly
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1em' }}>
							<Col xs={12}>
								<Field
									name='sender.email'
									label='Email'
									accepter={Input}
									readOnly
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='sender.phone'
									label='Phone'
									accepter={Input}
									readOnly
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={24}>
								<Field
									name='sender.companyName'
									label='Company name'
									accepter={Input}
									readOnly
								/>
							</Col>
						</Row>
					</Panel>

					{/* <Panel bordered style={{ marginBottom: '1.4em' }}>
						<Row style={{ marginBottom: '1.5em' }}>
							<Col xs={6}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Status
									</span>
									<p
										style={{
											opacity: 0.8,
											fontSize: 13,
											textTransform: 'capitalize',
										}}
									>
										{message?.status}
									</p>
								</Stack>
							</Col>

							<Col xs={6}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Acknowledge date
									</span>
									<p
										style={{
											textTransform: 'capitalize',
											opacity: 0.8,
											fontSize: 13,
										}}
									>
										{message?.acknowledgedOn
											? formatDate(message?.acknowledgedOn)
											: 'N/A'}
									</p>
								</Stack>
							</Col>
							<Col xs={6}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Attended by
									</span>
									<p
										style={{
											textTransform: 'capitalize',
											opacity: 0.8,
											fontSize: 13,
										}}
									>
										{message?.attendedBy
											? message.attendedBy.lastName
												? message.attendedBy.firstName +
												  ' ' +
												  message.attendedBy.lastName
												: message.attendedBy.firstName
											: 'N/A'}
									</p>
								</Stack>
							</Col>
							<Col xs={6}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Sent date
									</span>
									<p
										style={{
											textTransform: 'capitalize',
											opacity: 0.8,
											fontSize: 13,
										}}
									>
										{message && formatDate(message.createdAt)}
									</p>
								</Stack>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.5em' }}>
							<Col xs={6}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Completed date
									</span>
									<p
										style={{
											textTransform: 'capitalize',
											opacity: 0.8,
											fontSize: 13,
										}}
									>
										{message?.completedOn
											? formatDate(message?.completedOn)
											: 'N/A'}
									</p>
								</Stack>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.5em' }}>
							<Col xs={24}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Sender Details
									</span>
									<Stack
										direction='column'
										alignItems='flex-start'
										style={{ opacity: 0.8, fontSize: 13 }}
									>
										<div>First name: {message?.sender?.firstName}</div>
										<div>Last name: {message?.sender?.lastName}</div>
										<div>Email: {message?.sender?.email}</div>
										<div>Phone: {message?.sender?.phone}</div>
										<div>
											Company name: {message?.sender?.companyName || 'N/A'}
										</div>
									</Stack>
								</Stack>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.5em' }}>
							<Col xs={24}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Subject
									</span>
									<p
										style={{
											textTransform: 'capitalize',
											opacity: 0.8,
											fontSize: 13,
										}}
									>
										{message?.subject}
									</p>
								</Stack>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.5em' }}>
							<Col xs={24}>
								<Stack direction='column' alignItems='flex-start'>
									<span
										style={{
											fontWeight: 500,
											display: 'inline-block',
											marginBottom: '.4em',
										}}
									>
										Body
									</span>
									<p
										style={{
											textTransform: 'capitalize',
											opacity: 0.8,
											fontSize: 13,
										}}
									>
										{message?.body}
									</p>
								</Stack>
							</Col>
						</Row>
					</Panel> */}
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default MessagesDrawer
