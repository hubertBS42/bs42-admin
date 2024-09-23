'use client'
import {
	Col,
	Form,
	Grid,
	HStack,
	IconButton,
	Loader,
	Panel,
	Row,
	Text,
	VStack,
} from 'rsuite'
import Comment from '../Comment/Comment'
import { useEffect, useState } from 'react'
import { fetcher, formatComments } from '@/utils/functions'
import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'

import PlusIcon from '@rsuite/icons/Plus'
import CommentModal from '../CommentModal/CommentModal'
import Field from '../Field/Field'
import TextEditor from '../TextEditor/TextEditor'
import CommentPostField from '../CommentPostField/CommentPostField'

const Comments = ({ typeRef }) => {
	const session = useSession()

	const user = session?.data?.user

	const [open, setOpen] = useState(false)

	const [isLoading, setIsLoading] = useState(false)
	const [commentMode, setCommentMode] = useState('add')
	const [comment, setComment] = useState(null)
	const [comments, setComments] = useState([])
	const [count, setCount] = useState(0)

	const handleOpen = state => {
		setCommentMode(state)
		setOpen(true)
	}
	const handleClose = () => setOpen(false)

	const loadComments = async () => {
		setIsLoading(true)

		const {
			status,
			message,
			data: { comments, count },
		} = await fetcher(`/api/comments?typeRef=${typeRef}`)

		setIsLoading(false)

		if (status === 'error')
			return toast.error('Failed to load comments.')

		setComments(formatComments(comments))
		setCount(count)
	}

	const addComment = async data => {
		const {
			status,
			message,
			data: comment,
		} = await fetcher('/api/comments/add', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		if (status === 'error') return toast.error('Failed add comment.')

		loadComments()
	}

	const updateComment = async (comment, data) => {
		const { status, message } = await fetcher(
			`/api/comments/${comment.id}`,
			{
				method: 'PATCH',
				body: JSON.stringify(data),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			}
		)

		if (status === 'error') return toast.error('Failed update comment.')

		loadComments()
	}

	useEffect(() => {
		loadComments()
	}, [])

	return (
		<>
			{user && (
				<CommentModal
					user={user}
					comment={comment}
					typeRef={typeRef}
					commentMode={commentMode}
					open={open}
					addComment={addComment}
					updateComment={updateComment}
					handleClose={handleClose}
				/>
			)}

			<Panel
				header={
					<HStack justifyContent='space-between'>
						<span>Comments ({count})</span>
						<IconButton
							icon={<PlusIcon />}
							circle
							size='sm'
							appearance='primary'
							onClick={() => handleOpen('add')}
						/>
					</HStack>
				}
			>
				<CommentPostField
					user={user}
					typeRef={typeRef}
					addComment={addComment}
					comment={comment}
					setComment={setComment}
				/>

				{/* <Grid fluid style={{ position: 'relative', minHeight: 400 }}>
					{!user ||
						(isLoading && (
							<Loader backdrop content='loading...' vertical />
						))}

					{comments.length > 0 ? (
						comments.map(comment => (
							<Row>
								<Col xs={24}>
									<Comment
										key={comment.id}
										comment={comment}
										user={user}
										handleOpen={handleOpen}
										setComment={setComment}
									/>
								</Col>
							</Row>
						))
					) : (
						<Row style={{ minHeight: 400 }}>
							<Col xs={24}>
								<Text muted size='md'>
									No comments posted.
								</Text>
							</Col>
						</Row>
					)}
				</Grid> */}

				<VStack
					alignItems='stretch'
					style={{ position: 'relative', minHeight: 400 }}
					spacing={0}
				>
					{!user ||
						(isLoading && (
							<Loader backdrop content='loading...' vertical />
						))}
					{comments.length > 0 ? (
						comments.map(comment => (
							<Comment
								key={comment.id}
								comment={comment}
								user={user}
								handleOpen={handleOpen}
								setComment={setComment}
							/>
						))
					) : (
						<VStack
							alignItems='center'
							justifyContent='center'
							style={{ minHeight: 400 }}
						>
							<Text muted size='md'>
								No comments posted.
							</Text>
						</VStack>
					)}
				</VStack>
			</Panel>
		</>
	)
}
export default Comments
