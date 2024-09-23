'use client'
import { useRef, useState } from 'react'
import { Button, Col, Form, Grid, Modal, Row, Schema } from 'rsuite'

import CloseIcon from '@rsuite/icons/Close'
import CheckIcon from '@rsuite/icons/Check'

import Field from '../Field/Field'
import TextArea from '../TextArea/TextArea'

const { StringType } = Schema.Types

const model = Schema.Model({
	body: StringType().isRequired('This field is required.'),
})

const CommentModal = ({
	user,
	comment,
	typeRef,
	commentMode = 'add',
	open,
	addComment,
	updateComment,
	handleClose,
}) => {
	const formRef = useRef()

	const [formError, setFormError] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [formValue, setFormValue] = useState({
		parent: null,
		body: '',
		typeRef,
		user: user.id,
	})

	const updateForm = comment => {
		setFormError({})

		if (commentMode === 'edit') {
			setFormValue(prev => {
				return {
					...prev,
					parent: comment.parent,
					body: comment.body,
					typeRef: comment.typeRef,
					user: user.id,
				}
			})
		}

		if (commentMode === 'add') {
			setFormValue({
				parent: null,
				body: '',
				typeRef,
				user: user.id,
			})
		}

		if (commentMode === 'reply') {
			setFormValue({
				parent: comment.id,
				body: '',
				typeRef,
				user: user.id,
			})
		}

		return
	}

	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return
		}

		if (commentMode === 'add' || commentMode === 'reply') {
			// add
			setIsLoading(true)
			await addComment(formValue)
			setIsLoading(false)
			handleClose()
		}

		if (commentMode === 'edit') {
			//edit
			setIsLoading(true)
			await updateComment(comment, formValue)
			setIsLoading(false)
			handleClose()
		}
	}

	return (
		<Modal
			open={open}
			onClose={handleClose}
			backdrop='static'
			size='md'
			onEnter={() => updateForm(comment)}
		>
			<Modal.Header>
				{commentMode === 'add' && (
					<Modal.Title>Add a comment</Modal.Title>
				)}
				{commentMode === 'edit' && (
					<Modal.Title>Edit comment</Modal.Title>
				)}
				{commentMode === 'reply' && (
					<Modal.Title>
						Reply to {comment.user.firstName} {comment.user.lastName}
					</Modal.Title>
				)}
			</Modal.Header>
			<Modal.Body>
				<Form
					ref={formRef}
					onChange={setFormValue}
					onCheck={setFormError}
					formValue={formValue}
					model={model}
					disabled={isLoading}
				>
					<Grid fluid>
						<Row style={{ marginBottom: '1em' }}>
							<Col xs={24}>
								<Field
									name='body'
									label='Comment'
									accepter={TextArea}
									error={formError.body}
									value={formValue.body}
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
					disabled={isLoading}
					loading={isLoading}
					startIcon={<CheckIcon />}
				>
					Save
				</Button>
				<Button
					onClick={handleClose}
					disabled={isLoading}
					startIcon={<CloseIcon />}
				>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
export default CommentModal
