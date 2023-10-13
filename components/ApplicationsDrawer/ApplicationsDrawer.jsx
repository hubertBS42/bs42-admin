'use client'
import { useDispatch, useSelector } from 'react-redux'
import {
	Button,
	Col,
	Drawer,
	Form,
	Input,
	Panel,
	RadioTile,
	RadioTileGroup,
	Row,
	Toggle,
} from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'
import { useRef, useState } from 'react'
import CustomToggle from '../CustomToggle/CustomToggle'
import Field from '../Field/Field'
import TextArea from '../TextArea/TextArea'
import {
	getDrawerData,
	getDrawerLoadingState,
	getDrawerOpenState,
	setDrawerClose,
} from '@/redux/features/drawer/drawerSlice'
import { useSession } from 'next-auth/react'
import { updateApplication } from '@/redux/features/applications/applicationsActions'

const ApplicationsDrawer = () => {
	const { data: session } = useSession()
	const dispatch = useDispatch()
	const isLoading = useSelector(getDrawerLoadingState)
	const isOpen = useSelector(getDrawerOpenState)
	const data = useSelector(getDrawerData)

	const formRef = useRef()
	const [formValue, setFormValue] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone1: '',
		company: {
			name: '',
		},
		companyName: '',
		canReceiveEmails: false,
		isApproved: null,
		reviewer: '',
		reviewDate: null,
		reviewNotes: '',
	})

	const updateForm = data => {
		console.log(data)
		setFormValue(prev => {
			return {
				...prev,
				firstName: data?.firstName,
				lastName: data?.lastName,
				email: data?.email,
				phone1: data?.phone1,
				company: {
					name: data?.company.name,
				},
				companyName: data?.company.name,
				canReceiveEmails: data?.canReceiveEmails,
				isApproved: data?.isApproved,
				reviewer: data?.reviewer,
				reviewDate: data?.reviewDate,
				reviewNotes: data?.reviewNotes,
			}
		})
	}

	const handleApproval = value => {
		setFormValue(prev => {
			return { ...prev, isApproved: value === 'true' ? true : false }
		})
	}

	const handleSubmit = async () => {
		const preparedData = {
			...formValue,
			reviewDate: new Date().toISOString(),
			reviewer: session?.user.id,
		}

		delete preparedData.companyName

		await updateApplication(data, preparedData)
	}

	return (
		<Drawer
			open={isOpen}
			onClose={() => dispatch(setDrawerClose())}
			onEnter={() => updateForm(data)}
			size='lg'
		>
			<Drawer.Header style={{ paddingRight: '1.2em' }}>
				<Drawer.Title>Account Application</Drawer.Title>
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
					formValue={formValue}
					fluid
					disabled={isLoading}
				>
					<div style={{ width: '80px', marginBottom: '1.5em' }}>
						<CustomToggle
							accepter={Toggle}
							name='canReceiveEmails'
							label='Emails'
							disabled
						/>
					</div>

					<Panel bordered>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='firstName'
									label='First Name'
									accepter={Input}
									readOnly
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='lastName'
									label='Last Name'
									accepter={Input}
									readOnly
								/>
							</Col>
						</Row>

						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={12}>
								<Field
									name='email'
									label='Email Address'
									accepter={Input}
									readOnly
								/>
							</Col>
							<Col xs={12}>
								<Field
									name='phone1'
									label='Phone Number'
									accepter={Input}
									readOnly
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='companyName'
									label='Company Name'
									accepter={Input}
									readOnly
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: '1.4em' }}>
							<Col xs={24}>
								<Field
									name='reviewNotes'
									label='Notes'
									accepter={TextArea}
									value={formValue.reviewNotes}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={24}>
								<RadioTileGroup
									aria-label='Application approval status'
									inline
									disabled={data?.isApproved !== null}
									defaultValue={
										data?.isApproved ? data.isApproved.toString() : null
									}
									onChange={value => handleApproval(value)}
								>
									<RadioTile
										value='true'
										label='Approve'
										style={{
											width: '50%',
											textTransform: 'uppercase',
										}}
									/>
									<RadioTile
										value='false'
										style={{
											width: '50%',
											textTransform: 'uppercase',
										}}
										label='Reject'
									/>
								</RadioTileGroup>
							</Col>
						</Row>
					</Panel>
				</Form>
			</Drawer.Body>
		</Drawer>
	)
}
export default ApplicationsDrawer
