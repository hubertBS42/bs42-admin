'use client'
import { useRef, useState } from 'react'
import {
	Modal,
	Button,
	Row,
	Col,
	Input,
	Form,
	Schema,
	Grid,
} from 'rsuite'
import Field from '../Field/Field'
import { fetcher } from '@/utils/functions'
import { toast } from 'react-toastify'

const { StringType } = Schema.Types

const SendInvoiceModal = ({ enableSubmit, isLoading, order }) => {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const [isSending, setIsSending] = useState(false)

	const formRef = useRef()
	const [formError, setFormError] = useState({})
	const [formValue, setFormValue] = useState({
		firstName: '',
		lastName: '',
		email: '',
	})

	const model = Schema.Model({
		firstName: StringType().isRequired(
			'You must provide a first name.'
		),
		lastName: StringType().isRequired('You must provide a last name.'),
		email: StringType()
			.isRequired('You must provide an email address.')
			.isEmail('Please enter a valid email address.'),
	})

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		setIsSending(true)

		const preparedData = {
			...order,
			recipientFirstName: formValue.firstName,
			recipientLastName: formValue.lastName,
			recipientEmail: formValue.email,
		}

		const { status, message } = await fetcher('/api/invoices/email', {
			method: 'POST',
			body: JSON.stringify(preparedData),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		setIsSending(false)

		if (status === 'success') {
			toast.success(
				`Invoice was delivered to ${formValue.email} successfully.`
			)
			handleClose()
		} else {
			toast.error(`Failed to deliver the invoice to ${formValue.email}.`)
		}
	}

	return (
		<>
			<Button
				appearance='ghost'
				disabled={enableSubmit}
				loading={isLoading || isSending}
				onClick={handleOpen}
			>
				Send Invoice
			</Button>

			<Modal
				open={open}
				onClose={handleClose}
				backdrop='static'
				onEnter={() =>
					setFormValue(prev => {
						return {
							...prev,
							email: order.billing.email,
							firstName: order.billing.firstName,
							lastName: order.billing.lastName,
						}
					})
				}
			>
				<Modal.Header>
					<Modal.Title>Send Invoice</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						ref={formRef}
						onChange={setFormValue}
						onCheck={setFormError}
						formValue={formValue}
						model={model}
						style={{ height: 140 }}
						disabled={isSending}
					>
						<Grid fluid>
							<Row style={{ marginBottom: '1em' }}>
								<Col xs={12}>
									<Field
										name='firstName'
										label='Recipient first name:'
										accepter={Input}
										error={formError.firstName}
									/>
								</Col>
								<Col xs={12}>
									<Field
										name='lastName'
										label='Recipient last name:'
										accepter={Input}
										error={formError.lastName}
									/>
								</Col>
							</Row>
							<Row>
								<Col xs={24}>
									<Field
										name='email'
										label='Recipient email:'
										accepter={Input}
										error={formError.email}
									/>
								</Col>
							</Row>
						</Grid>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={handleSubmit}
						appearance='primary'
						loading={isSending}
					>
						Send
					</Button>
					<Button
						onClick={handleClose}
						appearance='subtle'
						disabled={isSending}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
export default SendInvoiceModal
