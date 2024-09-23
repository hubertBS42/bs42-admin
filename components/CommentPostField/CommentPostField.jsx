import { Button, Col, Form, Grid, HStack, Row, Schema } from 'rsuite'
import Field from '../Field/Field'
import TextEditor from '../TextEditor/TextEditor'
import { useRef, useState } from 'react'

const { StringType } = Schema.Types

const model = Schema.Model({
	body: StringType().isRequired('This field is required.'),
})

const CommentPostField = ({
	user,
	typeRef,
	comment,
	commentMode = 'add',
	addComment,
	updateComment,
	parent = null,
	setOpenedCommentField,
}) => {
	const formRef = useRef()

	const [formError, setFormError] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [formValue, setFormValue] = useState({
		parent,
		body: '',
		typeRef: typeRef ? typeRef : comment.typeRef,
		user: user.id,
	})

	const handleClearEditor = () => {
		// Hold editor content or any control over the editor
		setFormValue(prev => ({ ...prev, body: '' }))
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
		}

		if (commentMode === 'edit') {
			//edit
			setIsLoading(true)
			await updateComment(comment, formValue)
			setIsLoading(false)
		}

		if (commentMode === 'edit' || commentMode === 'reply') {
			setOpenedCommentField('')
		}

		handleClearEditor()
		setFormValue({
			parent,
			body: '',
			typeRef,
			user: user.id,
		})
	}
	return (
		<Form
			ref={formRef}
			onChange={setFormValue}
			onCheck={setFormError}
			formValue={formValue}
			model={model}
			disabled={isLoading}
		>
			<Grid fluid>
				<Row style={{ marginBottom: '1.2em' }}>
					<Col xs={24}>
						<Field
							name='body'
							accepter={TextEditor}
							error={formError.body}
							value={commentMode === 'edit' ? comment.body : formValue.body}
						/>
					</Col>
				</Row>

				<Row>
					<Col xs={24}>
						<HStack justifyContent='flex-end'>
							<Button
								onClick={handleSubmit}
								appearance='primary'
								disabled={isLoading}
								loading={isLoading}
							>
								Post
							</Button>
							{commentMode !== 'add' && (
								<Button
									disabled={isLoading}
									onClick={() => setOpenedCommentField('')}
								>
									Cancel
								</Button>
							)}
						</HStack>
					</Col>
				</Row>
			</Grid>
		</Form>
	)
}
export default CommentPostField
