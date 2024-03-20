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
import { formatDate } from '@/utils/functions'

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
		status: '',
		comments: [],
	})

	const isOpen = useSelector(getDrawerOpenState)
	const isLoading = useSelector(getDrawerLoadingState)
	const message = useSelector(getDrawerData)

	const updateForm = message => {
		setFormValue(prev => {
			return {
				...prev,
				status: message.status,
				comments: message.comments,
			}
		})

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		await updateMessage(message, formValue)
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(message)}
			backdrop='static'
			size='lg'
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
				>
					<Row style={{ marginBottom: 10 }}>
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

					<Panel bordered style={{ marginBottom: '1.4em' }}>
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
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default MessagesDrawer
